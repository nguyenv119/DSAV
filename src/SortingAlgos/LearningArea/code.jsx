import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const myCustomStyle = {
    ...oneDark,
    'pre[class*="language-"]': {
        ...oneDark['pre[class*="language-"]'],
        backgroundColor: 'rgb(25, 25, 25)',  
        color: 'white',
    },
    'code[class*="language-"]': {
        ...oneDark['code[class*="language-"]'],
        backgroundColor: 'rgb(25, 25, 25)', 
        color: 'white',
    },
    'operator': { color: '#F92672' },
    'punctuation': { color: '#8A888E' },
    'comment': { color: '#727072' },
    'keyword': { color: '#FC618D' },
    'function': {  color: '#7AD88F' },
    'number': {color: '#FD971F' },
    'boolean': { color: '#FD971F' },
    'variable': {  color: '#FD971F' },
    'class-name': { color: '#F4DD64' },
};


export const bubbleSortCodeComment = () => (
    <SyntaxHighlighter language="java" style={myCustomStyle}>
{`!! @param A: the array
!! @param n: the array length
bubbleSort(A, n) {
    didSwap ← true

    /* Every time we sort, this goes down by 1*/
    lastSortedIdx ← length(A) - 1
    /* Continue while we swap (still unsorted)*/
    while (didSwap and lastSortedIdx > 0) {
        didSwap ← false
        for i ← 0 to lastSortedIdx {
            
            /* We swap if an element is smaller than the next element */
            if (A[i] > A[i + 1]) {
                swap(A[i], A[i + 1]);
                /* We have swapped, so continue loop!*/
                didSwap ← true
            }
        }
    }
}
`}
  </SyntaxHighlighter>
);

export const selectionSortCodeComment = () => (
    <SyntaxHighlighter language="java" style={myCustomStyle}>
{`!! @param A: the array
!! @param n: the array length
selectionSort(A, n) {

    /* From the start to the 2nd last element.
    Not the last: we have guaranteed it will be sorted */
    for (i ← 0 to n - 2) {
        smallestIdx ← i

        /* Loop and find the smallest element */
        for (j ← (i + 1) to n - 1) {
            /* If this element < smallest_so_far, update it */
            if (A[j] < A[smallestIdx]) {
                smallestIdx ← j
            }
        }
        /* If it isn't the index we started with, swap */
        if (smallestIdx != j) {
            swap(A[i], A[smallestIdx])
        }
    }
}
`}
    </SyntaxHighlighter>
);

export const insertionSortCodeComment = () => (
    <SyntaxHighlighter language="java" style={myCustomStyle}>
{`!! @param A: the array
!! @param n: the array length
insertionSort(A, n) {

    /* Loop until the last element */
    for (idx ← 1 to n - 1) {
        prevIdx ← idx - 1
        prevVal ← A[prevIdx]
        currVal ← A[idx]

        /* While the found element is larger than the previous, and we haven't reached the end, keep moving it back */
        while (prevIdx >= 0 and currVal > prevVal) {
            swap(currVal, prevVal)
            prevIdx ← prevIdx - 1
        }
    }
}
`}
    </SyntaxHighlighter>
);

export const mergeSortCodeComment = () => (
<SyntaxHighlighter language="java" style={myCustomStyle}>
{`!! @param A: the array
!! @param left: the subarray's leftmost index 
!! @param right: the subarray's rightmost index 

mergeSort(A, left, right) {
    /* While our subarray is still larger than 1, split into 2 more subarrays*/
    if left < right {
        mid ← ⌊(left + right)/2⌋
        mergeSort(A, left, mid)
        mergeSort(A, mid + 1, right)
        merge(A, left, mid, right)
    }
}

!! @param A: the array
!! @param left: the subarray's leftmost index 
!! @param right: the subarray's rightmost index 
!! @param mid: the subarray's middle index

merge(A, left, mid, right) {
    /* Determine where to split A */
    split1 ← mid - left + 1
    split2 ← right - mid
    Create arrays L[0...split1] and R[0...split2]

    /* Transfer elements from A to L and R */
    for (i ← 0 to split1 - 1 do) {
        L[i] ← A[left + i - 1]
    }
    for (j ← 0 to split2 - 1 do) {
        R[j] ← A[mid + j]
    }

    /* Avoid checking if subarrays are fully copied */
    L[split1] ← ∞
    R[split2] ← ∞
    LIdx ← 0
    RIdx ← 0

    /* Compare L and R elements and merge into A */
    for (mainIdx ← left to right) {
        if L[LIdx] ≤ R[RIdx] {
            A[mainIdx] ← L[LIdx]
            LIdx ← LIdx + 1
        }
        else {
            A[mainIdx] ← R[RIdx]
            RIdx ← RIdx + 1
        }
    }
}
`}
</SyntaxHighlighter>
);

export const heapSortCodeComment = () => (
<SyntaxHighlighter language="java" style={myCustomStyle}>
{`!! @param A: the array
HEAPSORT(A) {
    BUILD_MAX_HEAP(A)
    /* Swap n elements */
    for (i ← length(A) downto 2) {
        swap(A[1], A[i])
        heap-size(A) ← heap-size(A) - 1

        /* HEAPIFY_DOWN the swapped element */
        HEAPIFY_DOWN(A, 1)
    }
}

!! @param A: the array 
!! @param idx: the index of the element being HEAPIFY_DOWNED
HEAPIFY_DOWN(A, idx) {
    /* Determine children of node */
    LChild ← 2i
    RChild ← 2i + 1

    /* Determine max of node and children */
    largestIdx ← max(A[i], A[LChild], A[RChild])
    /* If the i'th node isn't the largest, we swap */
    if (largest != i) {
        swap(A[i], A[largestIdx])

        /* Continue to HEAPIFY_DOWN until larger than all its children */
        HEAPIFY_DOWN(A, largestIdx)
    }
}

!! @param A: the array 
BUILD_MAX_HEAP(A) {
    heap-size(A) ← length(A)

    /* Only HEAPIFY_DOWN the 1st half of the array: top 50% of the tree*/
    for (i ← length(A)/2 downto 1) {
        HEAPIFY_DOWN(A, i)
    }
}
`}
</SyntaxHighlighter>
);