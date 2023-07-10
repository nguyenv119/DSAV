import {resetAllBarColors, greenify} from "./CommonMethods/commonMethods";
import {    PRIMARY_COLOR,
            SECONDARY_COLOR,
            LARGER_COLOR,
            SMALLER_COLOR,
            DONE_COLOR } from "../SortingVisualizer/SortingVisualizer";

const NO_SWITCH_COLOR = "#9706ff";

/*
* The heapSort function we are exporting with the animation array 
! We have to animate the buildMaxHeap and sorting differently, since they both use heapifyDown, 
! but we have different animations 
*/
export function heapSortExp(array, arrayBars, getSpeedCallback, comparisons, updateComparisons) {
    return new Promise((resolve) => {
        resetAllBarColors(arrayBars, PRIMARY_COLOR);     
        const [maxHeapAnimations, heapSortAnimations, arr] = getHeapSortAnimationArray(array.slice());
        /*
        ? animateMaxHeap returns a promise, only after which we called animateHeapSort */
        animateMaxHeap(maxHeapAnimations, arrayBars, 0, getSpeedCallback, comparisons, updateComparisons)
        .then((comparisons) => {
            /*
            ? animateHeapSort also returns a promise, which after it is done, then we return the original array to the React component for it to update its state with */
            animateHeapSort(heapSortAnimations, arrayBars, 0, getSpeedCallback, comparisons, updateComparisons)
            .then(() => {
                resolve(arr);
            })
        })
    });
}

function getHeapSortAnimationArray(arr) {
    if (arr.length <= 1) return arr;
    const maxHeapAnimations = [];
    const heapSortAnimations = [];
    heapSort(arr, maxHeapAnimations, heapSortAnimations);
    return [maxHeapAnimations, heapSortAnimations, arr];
}

/* 
* Build the max heap */
function buildMaxHeap(array, maxHeapAnimations) {
    let heapSize = array.length;
    for (let i = Math.floor((heapSize / 2)); i >= 0; i--) {
        heapifyDownMax(array, i, heapSize, maxHeapAnimations)
    }
}
  
/*
* HeapifyDown for building maxHeap DS */
function heapifyDownMax(arr, idx, heapSize, maxHeapAnimations) {
    /** If index is not a parent, return */
    if (idx >= Math.floor(heapSize / 2)) return;
    
    /** 0-indexing maxHeap, if idx has no right child, set it to null */
    let left = idx * 2 + 1;
    let right = idx * 2 + 2 < heapSize ? idx * 2 + 2 : null;
    let largest;

    if (right) {
        /** Initial comparison */ 
        maxHeapAnimations.push([idx, left, right]);
        if (arr[idx] > arr[left] && arr[idx] > arr[right]) largest = idx
        else largest = arr[left] > arr[right] ? left : right;
        
        /** Colorise, guaranteed the 0'th index is the largest one = green */
        if (largest === idx) maxHeapAnimations.push([largest, left, right]);
        else if (largest === left) maxHeapAnimations.push([largest, idx, right]);
        else maxHeapAnimations.push([largest, idx, left])
    } 
    else {
        /** Just colorise two, and swap two */
        maxHeapAnimations.push([idx, left]);
        largest = arr[left] > arr[idx] ? left : idx;
        if (largest === left) maxHeapAnimations.push([largest, idx]);
        else maxHeapAnimations.push([largest, left])
    }

    /** Switch heights (only the parent and largest), pass in values, then back to PRIMARY */
    maxHeapAnimations.push([largest, idx, arr[largest], arr[idx]]);

    if (arr[idx] < arr[largest]) {
        [arr[idx], arr[largest]] = [arr[largest], arr[idx]];
        heapifyDownMax(arr, largest, heapSize, maxHeapAnimations);
    }
}

/*
* HeapifyDown for sorting */
function heapifyDownSort(arr, idx, heapSize, heapSortAnimations, swapEnds) {

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
        heapifyDownSort(arr, largest, heapSize, heapSortAnimations, false);
    }
}

/*
* The actual heapSort function */
function heapSort(array, maxHeapAnimations, heapSortAnimations) {
    buildMaxHeap(array, maxHeapAnimations);
    let heapSize = array.length - 1; 
    for (let i = heapSize; i >= 1; i--) {
        [array[0], array[i]] = [array[i], array[0]];
        /** Initially pass in true, that we need to swap ends */
        heapSize--;
        heapifyDownSort(array, 0, heapSize + 1, heapSortAnimations, true);
    }
}

/*
 ! Build MAXHEAP ANIMATION
 * 0: We highlight the 3 bars to compare the indices(index, left, right)
 * 1: Highlight the largest one GREEN, the rest RED
 * 2: Switch heights, and keeping the color of the heights before, then back to primary, do i + 1 timing
 */    

function animateMaxHeap(maxHeapAnimations, arrayBars, completedAnimations, getSpeedCallback, comparisons, updateComparisons) {

    return new Promise(async resolve => {
        for (const animation of maxHeapAnimations) {

            const stage = completedAnimations % 3;
            let nextStepTimeout = 0;

            if (stage === 0) {
                for (let j = 0; j < animation.length; j++) {
                    arrayBars[animation[j]].style.backgroundColor = SECONDARY_COLOR;
                }
                completedAnimations++;
                nextStepTimeout = getSpeedCallback(); 
            }

            else if (stage === 1) {
                for (let j = 1; j < animation.length; j++) {
                    arrayBars[animation[j]].style.backgroundColor = SMALLER_COLOR;
                }
                arrayBars[animation[0]].style.backgroundColor = LARGER_COLOR;
                updateComparisons(comparisons + 1);
                comparisons++;
                completedAnimations++;

                nextStepTimeout = getSpeedCallback(); 
            }

            else {
                const [largestIdx, originalIdx, largestVal, originalVal] = animation;
                const largerStyle = arrayBars[largestIdx].style;
                const originalStyle = arrayBars[originalIdx].style;

                if (largestIdx !== originalIdx) {
                    [largerStyle.height, originalStyle.height] = [`${originalVal}px`, `${largestVal}px`];
                    originalStyle.backgroundColor = LARGER_COLOR;
                    largerStyle.backgroundColor = SMALLER_COLOR;
                } else {
                    for (let j = 0; j < maxHeapAnimations[completedAnimations - 1].length; j++) {
                        arrayBars[maxHeapAnimations[completedAnimations - 1][j]].style.backgroundColor = NO_SWITCH_COLOR;
                    }
                }

                /*
                ? Despite maxHeapAnimations going like:
                ? 0: [index, index...]
                ? 1: [indexSmall, indexBig...]
                ? 2: [switch heights] 
                
                ? And even though we are on 2, and want to access 1, Async nature of JS increments completedAnimations
                ? Instantaneously, so we we are on 3, essentially. 
                ! Thus, we have to do - 2*/
                setTimeout(() => {
                    console.log(maxHeapAnimations[completedAnimations - 2]);
                    for (let j = 0; j < maxHeapAnimations[completedAnimations - 2].length; j++) {
                        arrayBars[maxHeapAnimations[completedAnimations - 2][j]].style.backgroundColor = PRIMARY_COLOR;
                    }
                }, getSpeedCallback());
                
                completedAnimations++;
                nextStepTimeout = getSpeedCallback(); 
            }
            
            await new Promise(resolve => setTimeout(resolve, nextStepTimeout));
        }
        /*
        ? Promise returns how many comparisons have been made as to not reset it when we call aniamteHeapSort */
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
function animateHeapSort(heapSortAnimations, arrayBars, completedAnimations, getSpeedCallback, comparisons, updateComparisons) {
    return new Promise((resolve) => {
        if (completedAnimations >= heapSortAnimations.length) {
            greenify(completedAnimations, heapSortAnimations, arrayBars);
            resolve();
            return;
        }

        const i = completedAnimations;
        const stage = i % 5;

        let nextStepTimeout = 0;

        if (stage === 0) {
            if (heapSortAnimations[i].length === 0) {
                completedAnimations++;
            } else {
                const [beginningIdx, endIdx] = heapSortAnimations[i];
                const beginningStyle = arrayBars[beginningIdx].style;
                const endStyle = arrayBars[endIdx].style;
                [beginningStyle.backgroundColor, endStyle.backgroundColor] = [SECONDARY_COLOR, SECONDARY_COLOR];
                completedAnimations++;
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
            completedAnimations++;
            nextStepTimeout = getSpeedCallback(); 
        } 
        else if (stage === 2) {
            for (let j = 0; j < heapSortAnimations[i].length; j++) {
                arrayBars[heapSortAnimations[i][j]].style.backgroundColor = SECONDARY_COLOR;
            }
            completedAnimations++;
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
            completedAnimations++;
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
            completedAnimations++;

            setTimeout(() => {
                for (let j = 0; j < heapSortAnimations[i - 1].length; j++) {
                    arrayBars[heapSortAnimations[i - 1][j]].style.backgroundColor = PRIMARY_COLOR;
                }
            }, getSpeedCallback());
            nextStepTimeout = getSpeedCallback(); 
        }

        setTimeout(() => animateHeapSort(heapSortAnimations, arrayBars, completedAnimations, getSpeedCallback, comparisons, updateComparisons).then(() => resolve()), nextStepTimeout);
    });
}
