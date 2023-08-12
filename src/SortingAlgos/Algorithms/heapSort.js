import {resetAllBarColors, greenify} from "../CommonMethods/commonMethods";
import {    PRIMARY_COLOR,
            SECONDARY_COLOR,
            LARGER_COLOR as GREEN,
            SMALLER_COLOR as RED,
            DONE_COLOR } from "../../SortingVisualizer/SortingVisualizer";

const NO_SWITCH_COLOR = "#9706ff";

/*
* The heapSort function we are exporting with the animation array 
! We have to animate the buildMaxHeap and sorting differently, since they both use heapifyDown, 
! but we have different animations 
*/
export function heapSortExp(array, 
                            arrayBars, 
                            getSpeedCallback, 
                            comparisons, 
                            isPausedCallback, 
                            updateComparisons,
                            updateHighlight) {

    return new Promise((resolve) => {
        resetAllBarColors(arrayBars, PRIMARY_COLOR);     
        const [lines, animations, arr] = getHeapSortAnimationArray(array.slice());
        animate(lines, 0, animations, arrayBars, 0, getSpeedCallback, comparisons, isPausedCallback, updateComparisons, updateHighlight)
        .then(() => {
            resolve(arr);
        })
    });
}

function getHeapSortAnimationArray(arr) {
    if (arr.length <= 1) return arr;
    const lines = [];
    const animations = [];
    heapSort(arr, lines, animations);
    return [lines, animations, arr];
}

/* line 27
* Build the max heap */
function buildMaxHeap(lines, array, animations) {
    lines.push(["YES", 32])
    let heapSize = array.length;
    lines.push(["YES", 33]);
    for (let i = Math.floor((heapSize / 2)) - 1; i >= 0; i--) {
        lines.push(["YES", 35]);
        lines.push(["YES", 36]); 
        heapifyDown(lines, array, i, heapSize, animations);
    }
    lines.push(["NO", 35])
}
  
/* line 14
* HeapifyDown for building maxHeap DS */
function heapifyDown(lines, arr, idx, heapSize, animations) {
    /** If index is not a parent, return */
    lines.push(["YES", "14"]);
    animations.push([idx]);

    if (idx >= Math.floor(heapSize / 2)) {
        lines.push(["YES", 16]);
        lines.push(["YES", 17]);
        return;
    }
    
    /** 0-indexing maxHeap, if idx has no right child, set it to null */
    let left = idx * 2 + 1;
    lines.push(["YES", "20"]);
    animations.push([left]);

    let right = idx * 2 + 2 < heapSize ? idx * 2 + 2 : null;
    if (right) {
        lines.push(["YES", "21"]);
        animations.push([right]);
    } else {
        lines.push(["NO", "21"]);
        animations.push([]);
    }

    let largest;
    lines.push(["YES", 23]);

    if (right) {
        /** Initial comparison */ 
        if (arr[idx] > arr[left] && arr[idx] > arr[right]) largest = idx
        else largest = arr[left] > arr[right] ? left : right;
        
        /** Colorise, guaranteed the 0'th index is the largest one = green */
        if (largest === idx) animations.push([largest, left, right]);
        else if (largest === left) animations.push([largest, idx, right]);
        else animations.push([largest, idx, left])
    } 
    else {
        /** Just colorise two, and swap two */
        largest = arr[left] > arr[idx] ? left : idx;
        if (largest === left) animations.push([largest, idx]);
        else animations.push([largest, left])
    }

    
    if (arr[idx] < arr[largest]) {
        lines.push(["YES", 25]);
        
        /** Switch heights (only the parent and largest), pass in values, then back to PRIMARY */
        animations.push([largest, idx, arr[largest], arr[idx]]);
        [arr[idx], arr[largest]] = [arr[largest], arr[idx]];
        lines.push(["YES", 26]);

        lines.push(["YES", 28]);
        heapifyDown(lines, arr, largest, heapSize, animations);
    } else {
        lines.push(["NO", 25]);
    }

    /* Reset all colors after highlighting. Highlight the for loop, and reset */
    if (right) animations.push([idx, left, right]);
    else animations.push([idx, left]);
    lines.push(["RESET", 35])
}

/*
* The actual heapSort function */
function heapSort(array, lines, animations) {
    lines.push(["YES", 2]);
    buildMaxHeap(lines, array, animations);
    lines.push(["YES", 3]);
    let heapSize = array.length - 1; 

    for (let i = heapSize; i >= 1; i--) {
        lines.push(["YES", 5]);

        /** Highlight ends */
        lines.push(["YES", 6]);
        animations.push(["S0", 0, heapSize]);
        [array[0], array[i]] = [array[i], array[0]];
        /** Switch ends, keep secondary colors, then i + 1 to primary the heapSize index bar */
        animations.push(["S1"]);
        
        lines.push(["YES", 7]);
        lines.push(["YES", 9]);
        /** Initially pass in true, that we need to swap ends */
        heapSize--;
        heapifyDown(lines, array, 0, heapSize + 1, animations);
    }
    lines.push(["NO", 5]);
}

/*
 ! Build MAXHEAP ANIMATION
 * 0: We highlight the 3 bars to compare the indices(index, left, right)
 * 1: Highlight the largest one GREEN, the rest RED
 * 2: Switch heights, and keeping the color of the heights before, then back to primary, do i + 1 timing
 */    

async function animate(lines, linesIdx, animations, arrayBars, animationsIdx, getSpeedCallback, comparisons, updateComparisons, isPausedCallback, updateHighlight) {

    return new Promise(async resolve => {
        while (linesIdx < lines.length) {

            /*
            ? If animation is paused, pause execution until Promise is resolved/rejected and then starts from loop 
            ! We can't use a while loop here, as there would be an infinite loop while animation is paused, as the loop 
            ! would keep checking the condition isPausedCallback() continuously without allowing the rest of the function to 
            ! proceed until isPausedCallback turns false
            
            * Eg: Prints 1, 2, 3, 4, 6...etc
            for i in range(10):
                if i == 5:
                    continue
                print(i)*/

            if (isPausedCallback()) {
                /*
                ? Pauses execution, and delays the execution by getSpeedCallback() amount of MS:
                * setTimeout schedules the "resolve" by ^ time, which is provided by the promise
                * Promise that after being resolved, after getSpeedCallback MS, will continue to the next iteration */
                await new Promise(resolve => setTimeout(resolve, getSpeedCallback()));

                /*
                ? Breaks out of "if" statement and goes back to while loop*/
                continue;
            }

            let highlightedLine = lines[linesIdx];
            let animationLine = animations[animationsIdx];

            // console.log("Highlight: ", highlightedLine);
            // console.log("Animation: ", animationLine);

            if (highlightedLine.includes(6)) {
                /* We need it to stay on 6, so we decrease the lineIdx */
                /* Highlight both bars */
                if (animationLine.includes("S0")) {
                    const [beginningIdx, endIdx] = [animationLine[1], animationLine[2]];
                    arrayBars[beginningIdx].style.backgroundColor = SECONDARY_COLOR;
                    arrayBars[endIdx].style.backgroundColor = SECONDARY_COLOR;
                    linesIdx--;

                /* Swap bars */
                } else if (animationLine.includes("S1")) {
                    const prevAnimationLine = animations[animationsIdx - 1];
                    const [beginningIdx, endIdx] = [prevAnimationLine[1], prevAnimationLine[2]];
                    [arrayBars[beginningIdx].style.height, arrayBars[endIdx].style.height] = [arrayBars[endIdx].style.height, arrayBars[beginningIdx].style.height];
                    arrayBars[endIdx].style.backgroundColor = DONE_COLOR;
                }
                animationsIdx++;
            
            /* Back to primary */
            } else if (highlightedLine.includes(7)) {
                const prevAnimationLine = animations[animationsIdx - 2];
                const beginningIdx = prevAnimationLine[1];
                arrayBars[beginningIdx].style.backgroundColor = PRIMARY_COLOR;

            /* left, right: If contains 1 element, means we are highlighting index, left, or right */
            } else if (highlightedLine.includes("14") || highlightedLine.includes("20") || highlightedLine.includes("21")) {

                /* If there is a right, if there isnt, just highlight the line */
                if (animationLine.length !== 0) {
                    arrayBars[animationLine[0]].style.backgroundColor = SECONDARY_COLOR;
                    if (highlightedLine.includes("14")) highlightedLine = ["YES", 14];
                    else if (highlightedLine.includes("20")) highlightedLine = ["YES", 20];
                    else if (highlightedLine.includes("21")) highlightedLine = ["YES", 21];
                } else {
                    highlightedLine = ["NO", 21];
                }
                animationsIdx++;

            /* Highlight all the bars the smaller color except the larger bar as the larger color */
            } else if (highlightedLine.includes(23)) {
                for (let j = 1; j < animationLine.length; j++) {
                    arrayBars[animationLine[j]].style.backgroundColor = RED;
                }
                arrayBars[animationLine[0]].style.backgroundColor = GREEN;
                updateComparisons(comparisons + 1);
                comparisons++;
                animationsIdx++;

            /* Swap bars if we do */
            }  else if (highlightedLine.includes(26)) {
                const [largestIdx, originalIdx, largestVal, originalVal] = animationLine;
                const largerStyle = arrayBars[largestIdx].style;
                const originalStyle = arrayBars[originalIdx].style;

                /* Swap */
                [largerStyle.height, originalStyle.height] = [`${originalVal}px`, `${largestVal}px`];
                originalStyle.backgroundColor = GREEN;
                largerStyle.backgroundColor = RED;
                animationsIdx++;
                
            /* Don't swap */
            } else if (highlightedLine.includes(25) && highlightedLine.includes("NO")) {
                let prevAnimationLine = animations[animationsIdx - 1];
                for (let j = 0; j < prevAnimationLine.length; j++) {
                    arrayBars[prevAnimationLine[j]].style.backgroundColor = NO_SWITCH_COLOR;
                }
                
            /* Setting all the bars back to the primary color */
            } else if (highlightedLine.includes(28)) {
                let prevAnimationLine = animations[animationsIdx - 2];
                for (let j = 0; j < prevAnimationLine.length; j++) {
                    arrayBars[prevAnimationLine[j]].style.backgroundColor = PRIMARY_COLOR;
                }
            } else if (highlightedLine.includes("RESET")) {
                for (let j = 0; j < animationLine.length; j++) {
                    arrayBars[animationLine[j]].style.backgroundColor = PRIMARY_COLOR;
                }
                highlightedLine = ["YES", 35];
                animationsIdx++;
            }

            updateHighlight(highlightedLine);
            linesIdx++;
            /*
            ? Sets the delay for the next animation of latest speed MS */
            await new Promise(resolve => setTimeout(resolve, getSpeedCallback()));
        }
        if (linesIdx == lines.length) {
            greenify(linesIdx, lines, arrayBars);
            resolve(comparisons);
            return;
        }
    })
}