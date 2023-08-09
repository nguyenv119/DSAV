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
        const [lines, maxHeapLines, maxHeapAnimations, heapSortAnimations, arr] = getHeapSortAnimationArray(array.slice());
        /*
        ? animateMaxHeap returns a promise, only after which we called animateHeapSort */
        animateMaxHeap(lines, 0, maxHeapLines, maxHeapAnimations, arrayBars, 0, getSpeedCallback, comparisons, isPausedCallback, updateComparisons, updateHighlight)
        .then((comparisons) => {
            /*
            ? animateHeapSort also returns a promise, which after it is done, then we return the original array to the React component for it to update its state with */
            animateHeapSort(lines, 0, heapSortAnimations, arrayBars, 0, getSpeedCallback, comparisons, isPausedCallback, updateComparisons, updateHighlight)
            .then(() => {
                resolve(arr);
            })
        })
    });
}

function getHeapSortAnimationArray(arr) {
    if (arr.length <= 1) return arr;
    const lines = [];
    const maxHeapAnimations = [];
    const heapSortAnimations = [];
    let maxHeapLines = heapSort(arr, lines, maxHeapAnimations, heapSortAnimations);
    return [lines, maxHeapLines, maxHeapAnimations, heapSortAnimations, arr];
}

/* line 27
* Build the max heap */
function buildMaxHeap(lines, array, maxHeapAnimations) {
    lines.push(["YES", 31])
    let heapSize = array.length;
    lines.push(["YES", 32]);
    for (let i = Math.floor((heapSize / 2)) - 1; i >= 0; i--) {
        lines.push(["YES", 34]);
        lines.push(["YES", 35]); 
        heapifyDownMax(lines, array, i, heapSize, maxHeapAnimations);
    }
    lines.push(["NO", 36])

    /* Returns the number of lines animated so far */
    console.log(lines);
    console.log(lines.length);
    return lines.length;
}
  
/* line 13
* HeapifyDown for building maxHeap DS */
function heapifyDownMax(lines, arr, idx, heapSize, maxHeapAnimations) {
    /** If index is not a parent, return */
    lines.push(["YES", "13"]);
    maxHeapAnimations.push([idx]);

    if (idx >= Math.floor(heapSize / 2)) {
        lines.push(["YES", 15]);
        lines.push(["YES", 16]);
        return;
    }
    
    /** 0-indexing maxHeap, if idx has no right child, set it to null */
    let left = idx * 2 + 1;
    lines.push(["YES", "19"]);
    maxHeapAnimations.push([left]);

    let right = idx * 2 + 2 < heapSize ? idx * 2 + 2 : null;
    if (right) {
        lines.push(["YES", "20"]);
        maxHeapAnimations.push([right]);
    } else {
        lines.push(["NO", "20"]);
        maxHeapAnimations.push([]);
    }

    let largest;
    lines.push(["YES", 22]);

    if (right) {
        /** Initial comparison */ 
        if (arr[idx] > arr[left] && arr[idx] > arr[right]) largest = idx
        else largest = arr[left] > arr[right] ? left : right;
        
        /** Colorise, guaranteed the 0'th index is the largest one = green */
        if (largest === idx) maxHeapAnimations.push([largest, left, right]);
        else if (largest === left) maxHeapAnimations.push([largest, idx, right]);
        else maxHeapAnimations.push([largest, idx, left])
    } 
    else {
        /** Just colorise two, and swap two */
        largest = arr[left] > arr[idx] ? left : idx;
        if (largest === left) maxHeapAnimations.push([largest, idx]);
        else maxHeapAnimations.push([largest, left])
    }

    
    if (arr[idx] < arr[largest]) {
        lines.push(["YES", 24]);
        
        /** Switch heights (only the parent and largest), pass in values, then back to PRIMARY */
        maxHeapAnimations.push([largest, idx, arr[largest], arr[idx]]);
        [arr[idx], arr[largest]] = [arr[largest], arr[idx]];
        lines.push(["YES", 25]);

        lines.push(["YES", 27]);
        heapifyDownMax(lines, arr, largest, heapSize, maxHeapAnimations);
    } else {
        lines.push(["NO", 24]);
    }

    /* Reset all colors after highlighting. Highlight the for loop, and reset */
    if (right) maxHeapAnimations.push([idx, left, right]);
    else maxHeapAnimations.push([idx, left]);
    lines.push(["RESET", 34])
}

/* line 13
* HeapifyDown for sorting */
function heapifyDownSort(lines, arr, idx, heapSize, heapSortAnimations, swapEnds) {

    let largest;

    /** Final Swapping time */
    if (heapSize === 1) {
        heapSortAnimations.push([0, heapSize]);
        heapSortAnimations.push([]);
        heapSortAnimations.push([idx]);
        largest = idx;
        heapSortAnimations.push([largest]);
        heapSortAnimations.push([largest, largest, arr[largest], arr[largest]]);
        return;
    }
    if (idx >= Math.floor(heapSize / 2)) return;

    let left = idx * 2 + 1;
    let right = idx * 2 + 2 < heapSize ? idx * 2 + 2 : null;
    /** Need to swap ends */
    if (swapEnds) {
        /** Highlight ends */
        heapSortAnimations.push([0, heapSize]);
        /** Switch ends, keep secondary colors, then i + 1 to primary the heapSize index bar */
        heapSortAnimations.push([]);
    } else {
        /** Fillers, no switchEnds */
        heapSortAnimations.push([]);
        heapSortAnimations.push([]);
    }
    if (right) {
        heapSortAnimations.push([idx, left, right]);
        if (arr[idx] > arr[left] && arr[idx] > arr[right]) largest = idx
        else largest = arr[left] > arr[right] ? left : right;
        
        if (largest === idx) heapSortAnimations.push([largest, left, right]);
        else if (largest === left) heapSortAnimations.push([largest, idx, right]);
        else heapSortAnimations.push([largest, idx, left])
    } 
    else {
        heapSortAnimations.push([idx, left]);
        largest = arr[left] > arr[idx] ? left : idx;
        if (largest === left) heapSortAnimations.push([largest, idx]);
        else heapSortAnimations.push([largest, left])
    }
    heapSortAnimations.push([largest, idx, arr[largest], arr[idx]]);

    
    if (idx !== largest) {
        [arr[idx], arr[largest]] = [arr[largest], arr[idx]];
        /** Since we don't need to swapEnds anymore */
        heapifyDownSort(lines, arr, largest, heapSize, heapSortAnimations, false);
    }
}

/*
* The actual heapSort function */
function heapSort(array, lines, maxHeapAnimations, heapSortAnimations) {
    lines.push(["YES", 2]);
    let maxHeapLines = buildMaxHeap(lines, array, maxHeapAnimations);
    let heapSize = array.length - 1; 
    for (let i = heapSize; i >= 1; i--) {
        [array[0], array[i]] = [array[i], array[0]];
        /** Initially pass in true, that we need to swap ends */
        heapSize--;
        heapifyDownSort(lines, array, 0, heapSize + 1, heapSortAnimations, true);
    }
    return maxHeapLines;
}

/*
 ! Build MAXHEAP ANIMATION
 * 0: We highlight the 3 bars to compare the indices(index, left, right)
 * 1: Highlight the largest one GREEN, the rest RED
 * 2: Switch heights, and keeping the color of the heights before, then back to primary, do i + 1 timing
 */    

async function animateMaxHeap(lines, linesIdx, maxHeapLines, maxHeapAnimations, arrayBars, animationsIdx, getSpeedCallback, comparisons, updateComparisons, isPausedCallback, updateHighlight) {

    return new Promise(async resolve => {
        console.log(maxHeapLines);
        while (linesIdx < maxHeapLines) {

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
            let animationLine = maxHeapAnimations[animationsIdx];

            console.log("Highlight: ", highlightedLine);
            console.log("Animation: ", animationLine);
            console.log("linesIdx: ", linesIdx);

            /* If contains 1 element, means we are highlighting index, left, or right */
            if (highlightedLine.includes("13") || highlightedLine.includes("19") || highlightedLine.includes("20")) {

                /* If there is a right, if there isnt, just highlight the line */
                if (animationLine.length !== 0) {
                    arrayBars[animationLine[0]].style.backgroundColor = SECONDARY_COLOR;
                    if (highlightedLine.includes("13")) highlightedLine = ["YES", 13];
                    else if (highlightedLine.includes("19")) highlightedLine = ["YES", 19];
                    else if (highlightedLine.includes("20")) highlightedLine = ["YES", 20];
                } else {
                    highlightedLine = ["NO", 20];
                }
                animationsIdx++;

            /* Highlight all the bars the smaller color except the larger bar as the larger color */
            } else if (highlightedLine.includes(22)) {
                for (let j = 1; j < animationLine.length; j++) {
                    arrayBars[animationLine[j]].style.backgroundColor = RED;
                }
                arrayBars[animationLine[0]].style.backgroundColor = GREEN;
                updateComparisons(comparisons + 1);
                comparisons++;
                animationsIdx++;

            /* Swap bars if we do */
            }  else if (highlightedLine.includes(25)) {
                const [largestIdx, originalIdx, largestVal, originalVal] = animationLine;
                const largerStyle = arrayBars[largestIdx].style;
                const originalStyle = arrayBars[originalIdx].style;

                /* Swap */
                [largerStyle.height, originalStyle.height] = [`${originalVal}px`, `${largestVal}px`];
                originalStyle.backgroundColor = GREEN;
                largerStyle.backgroundColor = RED;
                animationsIdx++;
                
            /* Don't swap */
            } else if (highlightedLine.includes(24) && highlightedLine.includes("NO")) {
                let prevAnimationLine = maxHeapAnimations[animationsIdx - 1];
                for (let j = 0; j < prevAnimationLine.length; j++) {
                    arrayBars[prevAnimationLine[j]].style.backgroundColor = NO_SWITCH_COLOR;
                }
                // animationsIdx++;
                
            /* Setting all the bars back to the primary color */
            } else if (highlightedLine.includes(27)) {
                let prevAnimationLine = maxHeapAnimations[animationsIdx - 2];
                for (let j = 0; j < prevAnimationLine.length; j++) {
                    arrayBars[prevAnimationLine[j]].style.backgroundColor = PRIMARY_COLOR;
                }
            } else if (highlightedLine.includes("RESET")) {
                for (let j = 0; j < animationLine.length; j++) {
                    arrayBars[animationLine[j]].style.backgroundColor = PRIMARY_COLOR;
                }
                highlightedLine = ["YES", 34];
                animationsIdx++;
            }

            updateHighlight(highlightedLine);
            linesIdx++;
            /*
            ? Sets the delay for the next animation of latest speed MS */
            await new Promise(resolve => setTimeout(resolve, getSpeedCallback()));
        }
        resolve(comparisons);
    })
}

/*
 ! HeapSort Animation
 * 0:  
 ? a) Sometimes, we already swapped, so no need to swap initially: []
 ? b) Every heapifyDown in sorting (not maxHeap) we switch ends: highlight ends
 * 1:
 ? a) IGNORE
 ? b) Swap end values bars
 * 2: Highlight 3 bars to compare the indices(index, left, right)
 * 3: Highlight the largest one GREEN, the rest RED
 * 4: Switch heights, and keeping the color of the heights before, then back to primary, do i + 1 timing
*/
function animateHeapSort(lines, linesIdx, heapSortAnimations, arrayBars, animationsIdx, getSpeedCallback, comparisons, updateComparisons, isPausedCallback, updateHighlight) {
    return new Promise((resolve) => {

        if (linesIdx >= lines.length) {
            greenify(linesIdx, lines, arrayBars);
            resolve();
            return;
        }

        if (isPausedCallback()) {
            setTimeout(() => {
                animateHeapSort(lines, linesIdx, heapSortAnimations, arrayBars, animationsIdx, getSpeedCallback, comparisons, updateComparisons, isPausedCallback, updateHighlight);
            }, getSpeedCallback());

            /*
            ? Return to stop continuation of animation after setTimeout */
            return;
        }

        const i = animationsIdx;
        const stage = i % 5;

        let nextStepTimeout = 0;

        if (stage === 0) {
            if (heapSortAnimations[i].length === 0) {
                animationsIdx++;
            } else {
                const [beginningIdx, endIdx] = heapSortAnimations[i];
                const beginningStyle = arrayBars[beginningIdx].style;
                const endStyle = arrayBars[endIdx].style;
                [beginningStyle.backgroundColor, endStyle.backgroundColor] = [SECONDARY_COLOR, SECONDARY_COLOR];
                animationsIdx++;
                nextStepTimeout = getSpeedCallback(); 
            }
        }
        else if (stage === 1) {
            if (heapSortAnimations[i - 1].length !== 0) {
                const [beginningIdx, endIdx] = heapSortAnimations[i - 1];
                const beginningStyle = arrayBars[beginningIdx].style;
                const endStyle = arrayBars[endIdx].style;

                [beginningStyle.height, endStyle.height] = [endStyle.height, beginningStyle.height];
                endStyle.backgroundColor = DONE_COLOR;
                updateComparisons(comparisons + 1);
                comparisons++
            }
            animationsIdx++;
            nextStepTimeout = getSpeedCallback(); 
        } 
        else if (stage === 2) {
            for (let j = 0; j < heapSortAnimations[i].length; j++) {
                arrayBars[heapSortAnimations[i][j]].style.backgroundColor = SECONDARY_COLOR;
            }
            animationsIdx++;
            nextStepTimeout = getSpeedCallback(); 
        } 
        else if (stage === 3) {
            for (let j = 0; j < heapSortAnimations[i].length; j++) {
                arrayBars[heapSortAnimations[i][j]].style.backgroundColor = SMALLER_COLOR;
            }
            if (heapSortAnimations[i].length !== 1) {
                updateComparisons(comparisons + 1);
                comparisons++
            }
            arrayBars[heapSortAnimations[i][0]].style.backgroundColor = LARGER_COLOR;
            animationsIdx++;
            nextStepTimeout = getSpeedCallback(); 
        } 
        else {
            const [largestIdx, originalIdx, largestVal, originalVal] = heapSortAnimations[i];
            const largerStyle = arrayBars[largestIdx].style;
            const originalStyle = arrayBars[originalIdx].style;

            if (largestIdx !== originalIdx) {
                [largerStyle.height, originalStyle.height] = [`${originalVal}px`, `${largestVal}px`];
                originalStyle.backgroundColor = LARGER_COLOR;
                largerStyle.backgroundColor = SMALLER_COLOR;
            } else {
                for (let j = 0; j < heapSortAnimations[i - 1].length; j++) {
                    arrayBars[heapSortAnimations[i - 1][j]].style.backgroundColor = NO_SWITCH_COLOR;
                }
            }
            animationsIdx++;
            nextStepTimeout = getSpeedCallback(); 

            setTimeout(() => {
                for (let j = 0; j < heapSortAnimations[i - 1].length; j++) {
                    arrayBars[heapSortAnimations[i - 1][j]].style.backgroundColor = PRIMARY_COLOR;
                }
            }, getSpeedCallback());
        }

        setTimeout(() => animateHeapSort(lines, linesIdx, heapSortAnimations, arrayBars, animationsIdx, getSpeedCallback, comparisons, updateComparisons, isPausedCallback, updateHighlight).then(() => resolve()), nextStepTimeout);
    });
}

