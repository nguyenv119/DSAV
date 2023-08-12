import {resetAllBarColors, greenify} from "../CommonMethods/commonMethods";
import {    PRIMARY_COLOR,
            SUPER_PRIMARY_COLOR,
            SECONDARY_COLOR,
            LARGER_COLOR as GREEN,
            SMALLER_COLOR as RED,
            SAMESIZE_COLOR,
            DONE_COLOR
        } from "../../SortingVisualizer/SortingVisualizer";

const GOOD_COLOR = "#9706ff";

/** The mergeSort function we are exporting with the animation array */
export function mergeSortExp(array, 
                            arrayBars, 
                            arrayBarsUp,
                            getSpeedCallback, 
                            comparisons, 
                            updateComparisons,
                            isPausedCallback,
                            updateHighlight) {
                        
    return new Promise((resolve) => {
        resetAllBarColors(arrayBars, PRIMARY_COLOR);        
        const [lines, animations, arr] = getMergeSortAnimationArray(array.slice());
        animate(lines, 0, array.length - 1, animations, arrayBars, arrayBarsUp, 0, getSpeedCallback, comparisons, updateComparisons, updateHighlight, isPausedCallback, 
            () => resolve(arr));
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
    mergeSort(arr, 0, arr.length - 1, copy, lines, animations);
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
        lines.push(["NO", "5", 5]);
        return;
    }

    /* Highlight the bars at the end. If its not index 0, means this is a subarray, and 
    we have to unhighlight the ends (animationsIdx - 2) and the mid (animationsIdx - 1 
    Or, we can implement it to set it to default with a delay in the future */

    animations.push(["ENDS", l, r]); /* Set from index 1 to end to primary */
    lines.push(["YES", "5", 5]);
    let m = Math.floor((l + r) / 2);
    animations.push(["MID", m]); /* Highlight the middle split */
    lines.push(["YES", "6", 6]);

    lines.push(["YES", "7", l, m, r]);
    mergeSort(copy, l, m, array, lines, animations);
    lines.push(["YES", "8", l, m, r]);
    mergeSort(copy, m + 1, r, array, lines, animations);
    lines.push(["YES", "9", 9]);
    merge(array, l, m, r, copy, lines, animations);

    /*
    ! Already highlighted SUPER_PRIMARY COMING IN */
    function merge(mainArr, l, m, r, copy, lines, animations) {
        if (mainArr == null) return null;
        let index = l;
        let i = l; 
        let j = m + 1;

        lines.push(["YES", 17]);
        lines.push(["YES", 18]);
        lines.push(["YES", 19]);
        lines.push(["YES", 20, 24]); /* for l to r: Set heights of arrayBars to 0px, and unhide the arrayBarsUp */
        animations.push(["SPLIT", l, m, r]); /* array[m] margin right */
        lines.push(["YES", 29]);
        lines.push(["YES", 30]);
    
        while (i <= m && j <= r) {
            /** When we compare two indices, we will
             * change the color of the bars to another color. */
            lines.push(["YES", 32]);
            animations.push([i, j]); 
            if (copy[i] <= copy[j]) {
                lines.push(["YES", "S0", 33]) /* Stage 0: compare arrayBarsUp */
                lines.push(["YES", "S1", 33]); 
                lines.push(["YES", "S2", 34]); 
                lines.push(["YES", 35]);

                animations.push([i, j]); /* Stage 1: compare values, 2nd 33 */
                animations.push([index, copy[i]]); /* Stage 2: put values back, and pink, set this arrayBarsUp value to hidden 34 */
                mainArr[index++] = copy[i++];
            }
            else {
                lines.push(["YES", "S0", 36]); /* Stage 0: compare arrayBarsUp */
                lines.push(["YES", "S1", 36]); 
                lines.push(["YES", "S2", 37]);
                lines.push(["YES", 38]);

                animations.push([j, i]); /* Stage 1: compare values, 2nd 36 */
                animations.push([index, copy[j]]);  /* Stage 2: put values back, and pink, set this arrayBarsUp value to hidden 37 */
                mainArr[index++] = copy[j++];
            }
        }
    
        while (i <= m) {
            lines.push(["YES", 32]); /* Simulate still in for loop */
            lines.push(["YES", "S0", "hi", 33]); /* Stage 0: compare arrayBarsUp */
            lines.push(["YES", "S1", "hi", 33]); /* Stage 1: compare values, 2nd 33 */
            lines.push(["YES", "S2", 34]); /* Stage 2: put values back, and pink, set this arrayBarsUp value to hidden 37 */
            lines.push(["YES", 35]);

            animations.push([i, i]);
            animations.push([i, i]);
            animations.push([index, copy[i]])
            mainArr[index++] = copy[i++];
        }
        while (j <= r) {
            lines.push(["YES", 32]); 
            lines.push(["YES", "S0", "hi", 36]);
            lines.push(["YES", "S1", "hi", 36]);
            lines.push(["YES", "S2", 37]);
            lines.push(["YES", 38]);

            animations.push([j, j]);
            animations.push([j, j]);
            animations.push([index, copy[j]])
            mainArr[index++] = copy[j++];
        }
        /* if this specific line 1. turn back to primary 2. copy arrayBars from l to r into arrayBarsUp */
        lines.push(["NO", 32, l, m, r]) 
    }
}

/** Animates mergeSort */
function animate(lines, linesIdx, length, animations, arrayBars, arrayBarsUp, animationsIdx, getSpeedCallback, comparisons, updateComparisons, updateHighlight, isPausedCallback, resolveCallback) {
    
    if (isPausedCallback()) {
        setTimeout(() => {
            animate(lines, linesIdx, length, animations, arrayBars, arrayBarsUp, animationsIdx, getSpeedCallback, comparisons, updateComparisons, updateHighlight, isPausedCallback, resolveCallback);
        }, getSpeedCallback())
        return;
    }

    if (linesIdx >= lines.length) {
        greenify(linesIdx, lines, arrayBars);
        resolveCallback(animations) 
        return;
    } 

    let nextStepTimeout = 0;
    let highlightedLine = lines[linesIdx];
    let animationLine = animations[animationsIdx];

    // console.log("LineIdx", highlightedLine);
    // console.log("AnimationIdx", animationLine);
    
    /*
    ? Actual MergeSort algorithm animations */
    /* Set from index l to r to PRIMARY */
    if (highlightedLine.includes("5")) {
        if (highlightedLine.includes("YES")) {
            let [l, r] = [animationLine[1], animationLine[2]];
            for (let j = 0; j < l; j++) arrayBars[j].style.backgroundColor = PRIMARY_COLOR;
            for (let j = r + 1; j <= length; j++) arrayBars[j].style.backgroundColor = PRIMARY_COLOR;
            for (let i = l; i <= r; i++) {
                arrayBars[i].style.backgroundColor = SUPER_PRIMARY_COLOR;
            }
            animationsIdx++;
        }

    /* Highlight the middle split */
    } else if (highlightedLine.includes("6")) {
        let mid = animationLine[1];
        arrayBars[mid].style.backgroundColor = DONE_COLOR;
        animationsIdx++;
    /* Highlight l to m PRIMARY_SUPER, and m + 1 to r, PRIMARY */
    } else if (highlightedLine.includes("7")) {
        let prevAnimationLine = animations[animationsIdx - 1];
        let pinkIndex = prevAnimationLine[1];
        arrayBars[pinkIndex].style.backgroundColor = SUPER_PRIMARY_COLOR;

        let [l, m, r] = [highlightedLine[2], highlightedLine[3], highlightedLine[4]];

        for (let i = l; i <= m; i++) {
            arrayBars[i].style.backgroundColor = SUPER_PRIMARY_COLOR;
        }
        for (let i = m + 1; i <= r; i++) {
            arrayBars[i].style.backgroundColor = PRIMARY_COLOR;
        }

        highlightedLine = ["YES", 7];
        /* We want 8 to be only be 1 behind SPLIT. So, if this 7 is behind 8, as in it
        doesnt keep splitting, we increment the animationsIdx */
        if (lines[linesIdx + 2].includes("8")) animationsIdx++;

    /* Highlight m + 1 to r PRIMARY_SUPER, and l to m, PRIMARY */
    } else if (highlightedLine.includes("8")) {
        let [l, m, r] = [highlightedLine[2], highlightedLine[3], highlightedLine[4]];
        for (let i = l; i <= m; i++) {
            arrayBars[i].style.backgroundColor = PRIMARY_COLOR;
        }
        for (let i = m + 1; i <= r; i++) {
            arrayBars[i].style.backgroundColor = SUPER_PRIMARY_COLOR;
        }
        
        highlightedLine = ["YES", 8];
        /* If we are about to merge, we want 9 to be at the SPLIT */
        if (animationLine[1] === animationLine[2] && lines[linesIdx + 2].includes("9")) {
            animationsIdx++;
        }

    /* We have to highlight both subarrays SUPER again before merging to show */
    } else if (highlightedLine.includes("9")) {
        let [l, r] = [animationLine[1], animationLine[3]];
        for (let i = l; i <= r; i++) {
            arrayBars[i].style.backgroundColor = SUPER_PRIMARY_COLOR;
        }
        highlightedLine = ["YES", 9];
        
    /* for l to r: Set heights of arrayBars to 0px, and unhide the arrayBarsUp */
    } else if (highlightedLine.includes(20) && highlightedLine.includes("YES")) {
        /* We are on SPLIT */
        let [l, m, r] = [animationLine[1], animationLine[2], animationLine[3]];
        let i = l;
        while (i <= r) {
            arrayBarsUp[i].style.height = arrayBars[i].style.height ;
            arrayBars[i].style.height = "0px";
            arrayBarsUp[i].style.display = "inline-block";
            arrayBarsUp[i].style.backgroundColor = SUPER_PRIMARY_COLOR;
            if (i === m) {
                arrayBarsUp[i].style.marginRight= "1%";
            }
            i++;
        }
        animationsIdx++;

    } else if (highlightedLine.includes("S0")) {
        /* Stage 0 */
        const [barOneIdx, barTwoIdx] = animationLine;
        const barOneStyle = arrayBarsUp[barOneIdx].style;
        const barTwoStyle = arrayBarsUp[barTwoIdx].style;        

        barOneStyle.backgroundColor = SECONDARY_COLOR;
        barTwoStyle.backgroundColor = SECONDARY_COLOR;
        if (highlightedLine.includes(33)) {
            highlightedLine = ["YES", 33];
        } else if (highlightedLine.includes(36)) {
            highlightedLine = ["YES", 36];
        }
        nextStepTimeout = getSpeedCallback();  
        animationsIdx++;

    } else if (highlightedLine.includes("S1")) {
        /* Stage 1 */
        const [indexSmall, indexLarge] = animationLine;
        const smallBarStyle = arrayBarsUp[indexSmall].style;
        const largeBarStyle = arrayBarsUp[indexLarge].style;

        if (indexSmall === indexLarge) {
            smallBarStyle.backgroundColor = GOOD_COLOR;
        } else if (arrayBarsUp[indexSmall] === arrayBarsUp[indexLarge]) {
            smallBarStyle.backgroundColor = SAMESIZE_COLOR;
            largeBarStyle.backgroundColor = SAMESIZE_COLOR;
        } else {
            smallBarStyle.backgroundColor = GREEN;
            largeBarStyle.backgroundColor = RED;
        }

        if (highlightedLine.includes(33)) {
            highlightedLine = ["YES", 33];
        } else if (highlightedLine.includes(36)) {
            highlightedLine = ["YES", 36];
        }

        updateComparisons(comparisons + 1);
        comparisons++;
        nextStepTimeout = getSpeedCallback();  
        animationsIdx++;

    /* Stage 2 */
    } else if (highlightedLine.includes("S2")) {
        /* Hides the smaller arrayBarsUp after choosing, and bigger, just back to primary */
        let prevLine = animations[animationsIdx - 1];
        let [smallerBarIdx, largerBarIdx] = [prevLine[0], prevLine[1]];
    
        arrayBarsUp[largerBarIdx].style.backgroundColor = SUPER_PRIMARY_COLOR;
        arrayBarsUp[smallerBarIdx].style.backgroundColor = SUPER_PRIMARY_COLOR;
        arrayBarsUp[smallerBarIdx].style.height = "0px";

        const [barLowerAppearIdx, lowerHeight] = animations[animationsIdx];
        const barLowerAppearStyle = arrayBars[barLowerAppearIdx].style;
        barLowerAppearStyle.height = `${lowerHeight}px`;
        barLowerAppearStyle.backgroundColor = DONE_COLOR;

        if (highlightedLine.includes(34)) {
            highlightedLine = ["YES", 34];
        } else if (highlightedLine.includes(37)) {
            highlightedLine = ["YES", 37];
        }
        animationsIdx++;
        nextStepTimeout = getSpeedCallback();  

    /* Reset colors and margins */
    } else if (highlightedLine.includes(32) && (highlightedLine.includes("NO"))) {
        let [l, m, r] = [highlightedLine[2], highlightedLine[3], highlightedLine[4]];
        for (let i = l; i <= r; i++) {
            arrayBars[i].style.backgroundColor = PRIMARY_COLOR;
            arrayBarsUp[i].style.backgroundColor = PRIMARY_COLOR;
            arrayBarsUp[i].style.height = "0px";
            arrayBarsUp[i].style.marginRight = "2px";
        }
        highlightedLine = ["NO", 32];
    }
    
    nextStepTimeout = getSpeedCallback(); 
    updateHighlight(highlightedLine);
    linesIdx++;
    
    setTimeout(() => animate(lines, linesIdx, length, animations, arrayBars, arrayBarsUp, animationsIdx, getSpeedCallback, comparisons, updateComparisons, updateHighlight, isPausedCallback, resolveCallback), nextStepTimeout);
}