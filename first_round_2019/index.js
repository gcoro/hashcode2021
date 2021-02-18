const path = process.argv[2];
const name = path.split('/')[path.split('/').length - 1].split('.')[0];
const fs = require('fs');

const readContent = () => {
    return fs.readFileSync(path, 'utf8');
};

const writeToFile = (rows) => {
    fs.writeFileSync('./' + name + '.out', rows.join('\n'), 'utf8');
};

/**
 *
 A = aa,bb,cc
 B = aa
 C = aa,bb,cc, a, b, d



 */




const parseInput = (contentToParse) => {
    const lines = contentToParse.split('\n');
    const photosNumber = parseInt(lines[0].split( ' ')[0]);
    const horizontalPhotos = [];
    const verticalPhotos = [];
    const result = [];

    for( let i=1; i<lines.length ;i++) {
        let photoData = lines[i].split(' ', );
        let orientation = photoData.shift();

        if(orientation=="H"){
            horizontalPhotos.push({
                'orientation':orientation,
                'numberOfTags': parseInt(photoData.shift()),
                'tags': photoData,
                'index': i-1
            });
        } else {
            verticalPhotos.push({
                'orientation':orientation,
                'numberOfTags': parseInt(photoData.shift()),
                'tags': photoData,
                'index': i-1
            });
        }
    }

    let verticalSlides = [];

    while(verticalPhotos.length>1) {
        let currentSlide = verticalPhotos.shift();
        let max = 0;
        let selectedSlideIndex = 0;
        for(let i=0; i< verticalPhotos.length; i++){
            let tagsInCommon = verticalPhotos[i].tags.filter(value => currentSlide.tags.includes(value));

            if((currentSlide.tags+verticalPhotos[i].tags - (2*tagsInCommon)) > max){
                max = (currentSlide.tags+verticalPhotos[i].tags - (2*tagsInCommon));
                selectedSlideIndex =i;
            }
        }

        verticalSlides.push({
            'orientation': 'V',
            'index': currentSlide.index + ' ' + verticalPhotos[selectedSlideIndex].index,
            'tags': currentSlide.tags.concat(verticalPhotos[selectedSlideIndex].tags)
        });
    }

    const slides = verticalSlides.concat(horizontalPhotos);

    result.push(slides.length);
    let prevSlide = slides.shift();
    result.push(prevSlide.index);

    while(slides.length){
        console.log(slides.length)
        let selectedIndex = selectSlide(prevSlide, slides);
        let selectedSlide = slides.splice(selectedIndex, 1)[0];

        result.push(selectedSlide.index);
    }

    writeToFile(result);
};

const selectSlide = (prevSlide, slides) => {
    let selectedSlide = 0;
    let maxTagsInCommon = 0;
    const maxPossible = Math.floor(prevSlide.tags.length / 2);

    for(let i=0; i<slides.length && maxPossible!=maxTagsInCommon; i++){
        let prevSlideTag = prevSlide.tags.filter(value => !slides[i].tags.includes(value));
        let currentSlideTag = slides[i].tags.filter(value => !prevSlide.tags.includes(value));
        let tagsInCommon = slides[i].tags.filter(value => prevSlide.tags.includes(value));

        let min = Math.min(prevSlideTag.length, currentSlideTag.length, tagsInCommon.length);
        if(min > maxTagsInCommon) {
            maxTagsInCommon = min;
            selectedSlide = i;
        }
    }

    return selectedSlide;
}


const content = readContent();
parseInput(content);