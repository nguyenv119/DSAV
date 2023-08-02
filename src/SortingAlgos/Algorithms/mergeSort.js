import {resetAllBarColors, greenify} from "../CommonMethods/commonMethods";
import {    PRIMARY_COLOR,
            SUPER_PRIMARY_COLOR,
            SECONDARY_COLOR,
            LARGER_COLOR,
            SMALLER_COLOR,
            SAMESIZE_COLOR,
            DONE_COLOR
        } from "../../SortingVisualizer/SortingVisualizer";

const GOOD_COLOR = "#9706ff";

/** The mergeSort function we are exporting with the animation array */
export function mergeSortExp(array, 
                            arrayBars, 
                            getSpeedCallback, 
                            comparisons, 
                            updateComparisons,
                            isPausedCallback,
                            updateHighlight) {

    return new Promise((resolve) => {
        resetAllBarColors(arrayBars, PRIMARY_COLOR);        
        const [lines, animations, arr] = getMergeSortAnimationArray(array.slice());
        animate(lines, 0, animations, arrayBars, 0, getSpeedCallback, comparisons, updateComparisons, updateHighlight, isPausedCallback, () => resolve(arr));
    });
}

/**
 * The idea of the animations array is that some indices will have
 * arrays of [index, indexOther], while some will have [index, value].
 * 
 * This is because sometimes, we want to animate comparing two indices, 
 * not necesarilly swapping values yet: the former. When we swap values, 
 * the latter is used
 */
function getMergeSortAnimationArray(arr) {
    const animations = [];
    const lines = [];
    if (arr.length <= 1) return arr;
    const copy = arr.slice();
    mergeSort(arr, 0, arr.length - 1, copy, lines, animations)
    return [lines, animations, arr];
}

/** The actual merge sort function 
 * 0: initial compare
 * 1: indexSmall, indexLarge
 * 2: indexSmallValue, indexLargeValue
 * 3: replace index with heights
*/
function mergeSort(array, l, r, copy, lines, animations) {

    if (array == null) return null;
    if (array.length === 1) return array;

    /*
    ? IF THE ANIMATIONS ELEMENTS CONTAINS ENDS OR MID — DIFFERENTIATES IT FROM NORMAL ANIMATION */
    if (l === r) {
        animations.push(["ENDS", l, r]);
        lines.push(["NO", 5]);
        return;
    }

    /* Highlight the bars at the end. If its not index 0, means this is a subarray, and 
    we have to unhighlight the ends (animationsIdx - 2) and the mid (animationsIdx - 1 
    Or, we can implement it to set it to default with a delay in the future */

    animations.push(["ENDS", l, r]); /* Set from index 1 to end to SECONDARY COLOR */
    lines.push(["YES", 5]);
    let m = Math.floor((l + r) / 2);
    animations.push(["MID", m]); /* Highlight the middle split */
    lines.push(["YES", 6]);

    lines.push(["YES", 7]);
    mergeSort(copy, l, m, array, lines, animations);
    lines.push(["YES", 8]);
    mergeSort(copy, m + 1, r, array, lines, animations);
    lines.push(["YES", 9]);
    merge(array, l, m, r, copy, lines, animations);

    function merge(mainArr, l, m, r, copy, lines, animations) {
        if (mainArr == null) return null;
        animations.push(["PART", l, r]); /* Highlight all from l to r SUPER_PRIMARY */
        let index = l;
        let i = l; 
        let j = m + 1;

        lines.push(["YES", 17]);
        lines.push(["YES", 18]);
        lines.push(["YES", 19]);
        lines.push(["YES", 20, 24]); /* Copy arrayBars to arrayBarsUp halfway up the screen. Set heights of actual to 0px */
        animations.push(["SPLIT", l, m, r]); /* array[m] margin right */
        lines.push(["YES", 29]);
        lines.push(["YES", 30]);
    
        while (i <= m && j <= r) {
            /** When we compare two indices, we will
             * change the color of the bars to another color. */
            lines.push(["YES", 32]);
            animations.push([i, j]);  /* Stage 0: compare bars */
            if (copy[i] <= copy[j]) {
                lines.push(["YES", 33]); 
                lines.push(["YES", 33]); 
                lines.push(["YES", 34]); 
                lines.push(["YES", 35]);
                /** We have guaranteed that the i'th element
                 * is smaller than the j'th. Therefore we are
                 * replicating the swapping in the mainArray
                 * in the animationArray:
                 * 
                 * --> "index" is the index we have sorted so far.
                 * So we replace the index's index with the new height.
                 * 
                 * Why a replacement and not a swap? 
                 * Take auxiliary array [1, 3, 5, 2, 4, 6] = [1, 3, 5], [2, 4, 6]
                 * When we merge and compare the two auxilary arrays, all 
                 * we need to do is replace the original array with the value in
                 * the auxiliary one, and we are guaranteed that every element will be
                 * readded
                 * 
                 */
                animations.push([i, j]); /* Stage 1: compare values */
                animations.push([index, copy[i]]); /* Stage 2: put values back, and pink */
                mainArr[index++] = copy[i++];
            }
            else {
                lines.push(["YES", 36]);
                lines.push(["YES", 36]);
                lines.push(["YES", 37]);
                lines.push(["YES", 38]);

                animations.push([j, i]);
                animations.push([index, copy[j]]);
                mainArr[index++] = copy[j++];
            }
        }
    
        while (i <= m) {
            lines.push(["YES", 33]);
            lines.push(["YES", 33]);
            lines.push(["YES", 34]);
            lines.push(["YES", 35]);

            animations.push([i, i]);
            animations.push([i, i]);
            animations.push([index, copy[i]])
            mainArr[index++] = copy[i++];
        }
        while (j <= r) {
            lines.push(["YES", 36]);
            lines.push(["YES", 36]);
            lines.push(["YES", 37]);
            lines.push(["YES", 38]);

            animations.push([j, j]);
            animations.push([j, j]);
            animations.push([index, copy[j]])
            mainArr[index++] = copy[j++];
        }
        lines.push(["NO", 32]) /* if this specific line, turn back to primary */
    }
}

/** Animates mergeSort */
function animate(lines, linesIdx, animations, arrayBars, animationsIdx, getSpeedCallback, comparisons, updateComparisons, updateHighlight, isPausedCallback, resolveCallback) {
    
    if (isPausedCallback()) {
        setTimeout(() => {
            animate(lines, 0, animations, arrayBars, animationsIdx, getSpeedCallback, comparisons, updateComparisons, updateHighlight, isPausedCallback, resolveCallback);
        }, getSpeedCallback())
        return;
    }

    if (linesIdx >= lines.length) {
        greenify(linesIdx, lines, arrayBars);
        resolveCallback(animations) 
        return;
    } 

    const stage = animationsIdx % 3;

    let nextStepTimeout = 0;

    if (stage === 0) {
        const [barOneIdx, barTwoIdx] = animations[animationsIdx];
        const barOneStyle = arrayBars[barOneIdx].style;
        const barTwoStyle = arrayBars[barTwoIdx].style;        

        barOneStyle.backgroundColor = SECONDARY_COLOR;
        barTwoStyle.backgroundColor = SECONDARY_COLOR;
        animationsIdx++;

        /*
        ? We have to use the latest speed changed in the animation due to some delay */
        nextStepTimeout = getSpeedCallback();  
    
    } else if (stage === 1) {
        const [indexSmall, indexLarge] = animations[animationsIdx];
        const smallBarStyle = arrayBars[indexSmall].style;
        const largeBarStyle = arrayBars[indexLarge].style;

        /*
        ? If it's the same index, meaning extra elements from auxiliary left right arr */
        if (indexSmall === indexLarge) {
            smallBarStyle.backgroundColor = GOOD_COLOR;
        } else if (arrayBars[indexSmall] === arrayBars[indexLarge]) {
            smallBarStyle.backgroundColor = SAMESIZE_COLOR;
            largeBarStyle.backgroundColor = SAMESIZE_COLOR;
        } else {
            smallBarStyle.backgroundColor = LARGER_COLOR;
            largeBarStyle.backgroundColor = SMALLER_COLOR;
        }
        setTimeout(() => {
            smallBarStyle.backgroundColor = PRIMARY_COLOR;
            largeBarStyle.backgroundColor = PRIMARY_COLOR;
        }, getSpeedCallback());

        updateComparisons(comparisons + 1);
        comparisons++;
        animationsIdx++;
        nextStepTimeout = getSpeedCallback();  

    } else if (stage === 2) {
        const [barOneIdx, newHeight] = animations[animationsIdx];
        const barOneStyle = arrayBars[barOneIdx].style;
        barOneStyle.height = `${newHeight}px`;
        barOneStyle.backgroundColor = DONE_COLOR;
        animationsIdx++;

        /*
        ? Resets the color of the bars */
        setTimeout(() => {
            barOneStyle.backgroundColor = PRIMARY_COLOR;
        }, getSpeedCallback());
        nextStepTimeout = getSpeedCallback();  
    }
    nextStepTimeout = getSpeedCallback(); 
    updateHighlight(highlightedLine);
    linesIdx++;
    setTimeout(() => animate(lines, linesIdx, animations, arrayBars, animationsIdx, getSpeedCallback, comparisons, updateComparisons, isPausedCallback, resolveCallback), nextStepTimeout);
}

//Worse Case Calculation Errors
    /*
        | Current Case | Worse Case | Error |
        |--------------|------------|-------|
        | 12           | 12         | 0     |
        | 24           | 24         | 0     |
        | 34           | 33         | 1     |
        | 44           | 43         | 1     |
        | 64           | 64         | 0     |
        | 118          | 116        | 2     |
        | 148          | 147        | 1     |
        | 286          | 282        | 4     |
        | 512          | 506        | 6     |
        | 672          | 664        | 8     |
        | 832          | 829        | 3     |
        | 1094         | 1084       | 10    |
        | 1364         | 1349       | 15    |
        | 1544         | 1529       | 15    |
        | 1904         | 1898       | 6     |
        | 2488         | 2469       | 19    |

        ***Zach's Thinking***
        Seems to be linear relationship between size of the array and error size. This leads me to believe this might have something to
        do with rounding. Lets say somewhere in the merge sort algo we round from 0.99 -> 1. Initally this isnt a big deal as 1.1 will
        round down to 1 as an int. However, if we compound this 10 -> 100 -> 1000 -> etc  the error will grow bigger and bigger in a 
        linear fashion. There are some flaws in this theory because we see some outiers to my thinking such as 832 829 3. We would 
        expect the error to be larger than the previous one if it was truly compounding but it is less so it makes me reconsider my
        hypothesis.

        ***Chat GPT***
        Input Data Characteristics:
            The worst-case scenario for merge sort occurs when the input data is in the reverse order. In such cases, the algorithm 
            performs the maximum number of comparisons. However, in real-world data or random data, the input might have certain 
            characteristics that make it easier to sort. For example, if the input data is partially sorted or has some patterns, merge 
            sort may perform better than the worst-case scenario.

        Merge Sort Implementation:
            The number of comparisons made during merge sort can vary based on the specific implementation. Different implementations 
            might have slightly different comparison patterns, leading to variations in the number of comparisons for a given input.

        Overhead from Animation:
            It appears that the provided merge sort implementation also includes code for animation and visualization. The additional 
            operations required for visualization might cause some variations in the number of comparisons, especially for smaller input 
            sizes, as the animation overhead could be relatively more significant for smaller arrays.

        Precision and Rounding Errors:
            The error values (current case - worst case) are relatively small, and some of them are in single digits. It's possible that
            some of these differences could be due to precision errors or rounding issues, especially if the comparison count is being 
            tracked with floating-point numbers or if there's some small variation in the implementation.

        Small Sample Size:
            The dataset provided has a limited number of data points. With a small sample size, the observations might not fully 
            represent the overall trend, and occasional variations may occur due to random fluctuations.
        
    */