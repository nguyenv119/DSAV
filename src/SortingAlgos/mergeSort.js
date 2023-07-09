import {resetAllBarColors, greenify} from "./CommonMethods/commonMethods";
import {    PRIMARY_COLOR,
            SECONDARY_COLOR,
            LARGER_COLOR,
            SMALLER_COLOR,
            SAMESIZE_COLOR,
            DONE_COLOR
        } from "../SortingVisualizer/SortingVisualizer";

/** The mergeSort function we are exporting with the animation array */
export function mergeSortExp(array, arrayBars, getSpeedCallback, comparisons, updateComparisons) {
    return new Promise((resolve) => {
        resetAllBarColors(arrayBars, PRIMARY_COLOR);        
        const [animations, arr] = getMergeSortAnimationArray(array.slice());
        animate(animations, arrayBars, 0, getSpeedCallback, comparisons, updateComparisons, () => resolve(arr));
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
    if (arr.length <= 1) return arr;
    const copy = arr.slice();
    mergeSort(arr, 0, arr.length - 1, copy, animations)
    return [animations, arr];
}

/** The actual merge sort function 
 * 0: initial highlighting bars: index1, index2
 * 1: comparing values
 * 2: replace with heights: indexSmallValue, indexLargeValue
*/
function mergeSort(array, l, r, copy, animations) {

    function merge(mainArr, l, m, r, copy, animations) {
        if (mainArr == null) return null;
    
        let index = l;
        let i = l; 
        let j = m + 1;
    
        while (i <= m && j <= r) {
            /** When we compare two indices, we will
             * change the color of the bars to another color.
             */
            animations.push([i, j]);    
            if (copy[i] <= copy[j]) {
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
                animations.push([copy[i], copy[j]]);
                animations.push([index, copy[i]]);
                mainArr[index++] = copy[i++];
            }
            else {
                animations.push([copy[j], copy[i]]);
                animations.push([index, copy[j]]);
                mainArr[index++] = copy[j++];
            }
        }
    
        while (i <= m) {
            animations.push([i, i]);
            // animations.push([i, i]);
            animations.push([copy[i], copy[i]]);
            animations.push([index, copy[i]])
            mainArr[index++] = copy[i++];
        }
        while (j <= r) {
            animations.push([j, j]);
            // animations.push([j, j]);
            animations.push([copy[j], copy[j]]);
            animations.push([index, copy[j]])
            mainArr[index++] = copy[j++];
        }
    }

    if (array == null) return null;
    if (array.length === 1) return array;

    if (l === r) return;
    let m = Math.floor((l + r) / 2);
    mergeSort(copy, l, m, array, animations);
    mergeSort(copy, m + 1, r, array, animations);
    merge(array, l, m, r, copy, animations);
}


/*
? Animates mergeSort */
function animate(animations, arrayBars, completedAnimations, getSpeedCallback, comparisons, updateComparisons, resolveCallback) {
    if (completedAnimations >= animations.length) {
        greenify(completedAnimations, animations, arrayBars);
        resolveCallback(animations) 
        return;
    } 

    const i = completedAnimations;
    const stage = i % 3;

    let nextStepTimeout = 0;

    if (stage === 0) {
        const [barOneIdx, barTwoIdx] = animations[i];
        const barOneStyle = arrayBars[barOneIdx].style;
        const barTwoStyle = arrayBars[barTwoIdx].style;        

        barOneStyle.backgroundColor = SECONDARY_COLOR;
        barTwoStyle.backgroundColor = SECONDARY_COLOR;
        completedAnimations++;

        /*
        ? We have to use the latest speed changed in the animation due to some delay */
        nextStepTimeout = getSpeedCallback();  

    } else if (stage === 1) {
        const [indexSmall, indexLarge] = animations[i - 1];
        const smallBarStyle = arrayBars[indexSmall].style;
        const largeBarStyle = arrayBars[indexLarge].style;

        smallBarStyle.backgroundColor = LARGER_COLOR;
        largeBarStyle.backgroundColor = SMALLER_COLOR;

        setTimeout(() => {
            smallBarStyle.backgroundColor = PRIMARY_COLOR;
            largeBarStyle.backgroundColor = PRIMARY_COLOR;
        }, getSpeedCallback());
        updateComparisons(comparisons + 1);
        comparisons++;
        completedAnimations++;
        nextStepTimeout = getSpeedCallback();  

    } else if (stage === 2) {
        const [barOneIdx, newHeight] = animations[i];
        const barOneStyle = arrayBars[barOneIdx].style;
        barOneStyle.height = `${newHeight}px`;
        barOneStyle.backgroundColor = DONE_COLOR;
        completedAnimations++;

        /*
        ? Resets the color of the bars */
        setTimeout(() => {
            barOneStyle.backgroundColor = PRIMARY_COLOR;
        }, getSpeedCallback());
    }
    nextStepTimeout = getSpeedCallback();  
    setTimeout(() => animate(animations, arrayBars, completedAnimations, getSpeedCallback, comparisons, updateComparisons, resolveCallback), nextStepTimeout);
}
