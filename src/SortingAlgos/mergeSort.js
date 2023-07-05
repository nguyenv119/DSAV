import {resetAllBarColors, greenify} from "./CommonMethods/commonMethods";
import {    PRIMARY_COLOR,
            SECONDARY_COLOR,
            LARGER_COLOR,
            SMALLER_COLOR,
            SAMESIZE_COLOR,
            DONE_COLOR
        } from "../SortingVisualizer/SortingVisualizer";

/** The mergeSort function we are exporting with the animation array */
export function mergeSortExp(array, arrayBars, ANIMATION_SPEED_MS, comparisons, updateComparisons) {
    resetAllBarColors(arrayBars, PRIMARY_COLOR);        
    const [res, arr] = getMergeSortAnimationArray(array.slice());
    animate(res, arrayBars, 0, ANIMATION_SPEED_MS, comparisons, updateComparisons);
    return [res, arr, comparisons];
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
 * 0: initial compare
 * 1: indexSmall, indexLarge
 * 2: indexSmallValue, indexLargeValue
 * 3: replace index with heights
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
                animations.push([i, j]);
                animations.push([copy[i], copy[j]]);
                animations.push([index, copy[i]]);
                mainArr[index++] = copy[i++];
            }
            else {
                animations.push([j, i]);
                animations.push([copy[j], copy[i]]);
                animations.push([index, copy[j]]);
                mainArr[index++] = copy[j++];
            }
        }
    
        while (i <= m) {
            animations.push([i, i]);
            animations.push([i, i]);
            animations.push([copy[i], copy[i]]);
            animations.push([index, copy[i]])
            mainArr[index++] = copy[i++];
        }
        while (j <= r) {
            animations.push([j, j]);
            animations.push([j, j]);
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

/** Animates mergeSort */
function animate(res, arrayBars, completedAnimations, ANIMATION_SPEED_MS, comparisons, updateComparisons) {
        for (let i = 0; i < res.length; i++) {
            const stage = i % 4;
            
            if (stage === 0) {
              const [barOneIdx, barTwoIdx] = res[i];
              const barOneStyle = arrayBars[barOneIdx].style;
              const barTwoStyle = arrayBars[barTwoIdx].style;        
              setTimeout(() => {
                barOneStyle.backgroundColor = SECONDARY_COLOR;
                barTwoStyle.backgroundColor = SECONDARY_COLOR;
                completedAnimations += 2;
              }, (i) * ANIMATION_SPEED_MS);
              setTimeout(() => {
                barOneStyle.backgroundColor = PRIMARY_COLOR;
                barTwoStyle.backgroundColor = PRIMARY_COLOR;
            }, (i + 1) * ANIMATION_SPEED_MS);
            } 
            else if (stage === 2) {
                const [indexSmall, indexLarge] = res[i - 1];
                const [smallBar, largeBar] = res[i];
                const smallBarStyle = arrayBars[indexSmall].style;
                const largeBarStyle = arrayBars[indexLarge].style;
                if (indexSmall !== indexLarge) {
                    setTimeout(() => {
                        if (smallBar === largeBar) {
                            smallBarStyle.backgroundColor = SAMESIZE_COLOR;
                            largeBarStyle.backgroundColor = SAMESIZE_COLOR;
                        }
                        else {
                            smallBarStyle.backgroundColor = LARGER_COLOR;
                            largeBarStyle.backgroundColor = SMALLER_COLOR;
                        }
                        updateComparisons(comparisons + 1)
                        comparisons++;
                    }, (i - 1) * ANIMATION_SPEED_MS);
                    setTimeout(() => {
                        smallBarStyle.backgroundColor = PRIMARY_COLOR;
                        largeBarStyle.backgroundColor = PRIMARY_COLOR;
                    }, (i) * ANIMATION_SPEED_MS);
                }
                completedAnimations++;
            } 
            else if (stage === 3) {
                const [barOneIdx, newHeight] = res[i];
                const barOneStyle = arrayBars[barOneIdx].style;
                setTimeout(() => {
                    barOneStyle.height = `${newHeight}px`;
                    barOneStyle.backgroundColor = DONE_COLOR;
                    completedAnimations++;
                    greenify(completedAnimations, res, arrayBars);
                }, (i - 1) * ANIMATION_SPEED_MS);
                setTimeout(() => {
                    barOneStyle.backgroundColor = PRIMARY_COLOR;
                    greenify(completedAnimations, res, arrayBars);
                }, (i) * ANIMATION_SPEED_MS);
            }
          }
    }