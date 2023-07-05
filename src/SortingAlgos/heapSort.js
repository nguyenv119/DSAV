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
export function heapSortExp(array, arrayBars, ANIMATION_SPEED_MS, comparisons, updateComparisons) {
    resetAllBarColors(arrayBars, PRIMARY_COLOR);     
    const [maxHeapAnimations, heapSortAnimations, arr] = getHeapSortAnimationArray(array.slice());
    let newCompare = animateMaxHeap(maxHeapAnimations, arrayBars, 0, ANIMATION_SPEED_MS, comparisons, updateComparisons);
    animateHeapSort(heapSortAnimations, maxHeapAnimations, arrayBars, 0, ANIMATION_SPEED_MS, newCompare, updateComparisons);
    return [maxHeapAnimations, heapSortAnimations, arr];
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
    console.log(`${array}`);
}


/*
 ! Build MAXHEAP ANIMATION
 * 0: We highlight the 3 bars to compare the indices(index, left, right)
 * 1: Highlight the largest one GREEN, the rest RED
 * 2: Switch heights, and keeping the color of the heights before, then back to primary, do i + 1 timing
 */
function animateMaxHeap(maxHeapAnimations, arrayBars, completedAnimations, ANIMATION_SPEED_MS, comparisons, updateComparisons) {
    let alreadyCompared = comparisons;
    for (let i = 0; i < maxHeapAnimations.length; i++) {
        const stage = i % 3;
        /*
         ? maxHeapAnimations.push([idx, left, (right)]); */
        if (stage === 0) {
            setTimeout(() => {
                for (let j = 0; j < maxHeapAnimations[i].length; j++) {
                    arrayBars[maxHeapAnimations[i][j]].style.backgroundColor = SECONDARY_COLOR;
                }
                completedAnimations++;
            }, (i) * ANIMATION_SPEED_MS);
        }
        /* 
        ? maxHeapAnimations.push([largest, other, (other)]); */
        else if (stage === 1) {
            setTimeout(() => {
                for (let j = 0; j < maxHeapAnimations[i].length; j++) {
                    arrayBars[maxHeapAnimations[i][j]].style.backgroundColor = SMALLER_COLOR;
                }
                arrayBars[maxHeapAnimations[i][0]].style.backgroundColor = LARGER_COLOR;
                updateComparisons(comparisons + 1);
                comparisons++;
                // console.log(alreadyCompared);
                completedAnimations++;
            }, (i) * ANIMATION_SPEED_MS);
            alreadyCompared++;
        }
        /* 
        ? maxHeapAnimations.push([largest, idx, arr[largest], arr[idx]]); */
        else {
            const [largestIdx, originalIdx, largestVal, originalVal] = maxHeapAnimations[i];
            const largerStyle = arrayBars[largestIdx].style;
            const originalStyle = arrayBars[originalIdx].style;

            /** If Largest index is same as original index, turn PURPLE */            
            setTimeout(() => {
                if (largestIdx !== originalIdx) {
                    [largerStyle.height, originalStyle.height] = [`${originalVal}px`, `${largestVal}px`];
                    originalStyle.backgroundColor = LARGER_COLOR;
                    largerStyle.backgroundColor = SMALLER_COLOR;
                }
                else {
                    for (let j = 0; j < maxHeapAnimations[i - 1].length; j++) {
                        arrayBars[maxHeapAnimations[i - 1][j]].style.backgroundColor = NO_SWITCH_COLOR;
                    }
                }
                completedAnimations++;
            }, (i) * ANIMATION_SPEED_MS);

            /*
            ? Switch back PRIMARY */
            setTimeout(() => {
                for (let j = 0; j < maxHeapAnimations[i - 1].length; j++) {
                    arrayBars[maxHeapAnimations[i - 1][j]].style.backgroundColor = PRIMARY_COLOR;
                }
            }, (i + 1) * ANIMATION_SPEED_MS);
        }
    }
    return alreadyCompared;
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
function animateHeapSort(heapSortAnimations, maxHeapAnimations, arrayBars, completedAnimations, ANIMATION_SPEED_MS, comparisons, updateComparisons) {
    for (let i = 0; i < heapSortAnimations.length; i++) {
        const stage = i % 5;
        /*
        ? Switch ends, if we we are in the initial stage 
        ? heapSortAnimations.push([0, heapSize]);*/
        if (stage === 0) {
            /** If we don't switch ends */
            if (heapSortAnimations[i].length === 0) {
                setTimeout(() => {
                    completedAnimations++;
                }, (i + maxHeapAnimations.length) * ANIMATION_SPEED_MS)
            }
            else {
                setTimeout(() => {
                }, (i + maxHeapAnimations.length) * ANIMATION_SPEED_MS)
                const [beginningIdx, endIdx] = heapSortAnimations[i];
                const beginningStyle = arrayBars[beginningIdx].style;
                const endStyle = arrayBars[endIdx].style;
                setTimeout(() => {
                    [beginningStyle.backgroundColor, endStyle.backgroundColor] = [SECONDARY_COLOR, SECONDARY_COLOR];
                    completedAnimations++;
                }, (i + maxHeapAnimations.length) * ANIMATION_SPEED_MS);
            }
        }

        /*
        ? Switch bar heights beginning and end, and set in the (i + 1)'th time to reset color of end
        ? heapSortAnimations.push([arr[0], arr[heapSize]]) */
        else if (stage === 1) {
            if (heapSortAnimations[i - 1].length !== 0) {
                const [beginningIdx, endIdx] = heapSortAnimations[i - 1];
                const beginningStyle = arrayBars[beginningIdx].style;
                const endStyle = arrayBars[endIdx].style;
    
                setTimeout(() => {
                    [beginningStyle.height, endStyle.height] = [endStyle.height, beginningStyle.height];
                    endStyle.backgroundColor = DONE_COLOR;
                    updateComparisons(comparisons + 1);
                    comparisons++
                }, (i + maxHeapAnimations.length) * ANIMATION_SPEED_MS);
            }
            completedAnimations++;
        }
        else if (stage === 2) {
            setTimeout(() => {
                for (let j = 0; j < heapSortAnimations[i].length; j++) {
                    arrayBars[heapSortAnimations[i][j]].style.backgroundColor = SECONDARY_COLOR;
                }
                completedAnimations++;
            }, (i + maxHeapAnimations.length) * ANIMATION_SPEED_MS);
        }
        else if (stage === 3) {
            setTimeout(() => {
                for (let j = 0; j < heapSortAnimations[i].length; j++) {
                    arrayBars[heapSortAnimations[i][j]].style.backgroundColor = SMALLER_COLOR;
                }
                if (heapSortAnimations[i].length !== 1) {
                    updateComparisons(comparisons + 1);
                    comparisons++
                }
                arrayBars[heapSortAnimations[i][0]].style.backgroundColor = LARGER_COLOR;
                completedAnimations++;
            }, (i + maxHeapAnimations.length) * ANIMATION_SPEED_MS);
        }
        else {

            /** Problem is here */
            const [largestIdx, originalIdx, largestVal, originalVal] = heapSortAnimations[i];
            const largerStyle = arrayBars[largestIdx].style;
            const originalStyle = arrayBars[originalIdx].style;

            /** If Largest index is same as original index, turn PURPLE */            
            setTimeout(() => {
                if (largestIdx !== originalIdx) {
                    [largerStyle.height, originalStyle.height] = [`${originalVal}px`, `${largestVal}px`];
                    originalStyle.backgroundColor = LARGER_COLOR;
                    largerStyle.backgroundColor = SMALLER_COLOR;
                }
                else {
                    for (let j = 0; j < heapSortAnimations[i - 1].length; j++) {
                        arrayBars[heapSortAnimations[i - 1][j]].style.backgroundColor = NO_SWITCH_COLOR;
                    }
                }
                completedAnimations++;
            }, (i + maxHeapAnimations.length) * ANIMATION_SPEED_MS);
            
            /*
            ? Switch back PRIMARY */
            setTimeout(() => {
                for (let j = 0; j < heapSortAnimations[i - 1].length; j++) {
                    arrayBars[heapSortAnimations[i - 1][j]].style.backgroundColor = PRIMARY_COLOR;
                }
                greenify(completedAnimations, heapSortAnimations, arrayBars);
            }, (i + maxHeapAnimations.length + 1) * ANIMATION_SPEED_MS);
        }
    }
}