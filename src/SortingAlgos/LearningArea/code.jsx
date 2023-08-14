import { React, useRef, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import '../../Styles/App.css'

const colorMap = {
    "YES": "#4FAF4F",
    "NO": "#DC143C"
};

const defaultStyle = {
    ...oneDark,
    'pre[class*="language-"]': {
        ...oneDark['pre[class*="language-"]'],
        backgroundColor: 'rgb(27, 27, 27)',  
        color: 'white',minWidth: 'max-content'
    },
    'code[class*="language-"]': {
        ...oneDark['code[class*="language-"]'],
        backgroundColor: 'rgb(27, 27, 27)', 
        color: 'white',
        minWidth: 'max-content'
    },
    'operator': { color: '#F92672' },
    'punctuation': { color: '#8A888E' },
    'comment': { color: '#727072' },
    'keyword': { color: '#FC618D' },
    'function': {  color: '#3985FF' },
    'number': {color: '#FD971F' },
    'boolean': { color: '#FD971F' },
    'variable': {  color: '#FD971F' },
    'class-name': { color: '#F4DD64' },
};

const highlightStyle = (highlightColor) => ({
    ...defaultStyle,
    'code[class*="language-"]': {
      ...defaultStyle['code[class*="language-"]'],
      color: highlightColor,
      backgroundColor: "black",
      minWidth: 'max-content'
    },
    'pre[class*="language-"]': {
      ...defaultStyle['pre[class*="language-"]'],
      color: highlightColor,
      backgroundColor: "black",
      minWidth: 'max-content'
    },
    'operator': { color: highlightColor },
    'punctuation': { color: highlightColor },
    'comment': { color: highlightColor },
    'keyword': { color: highlightColor },
    'function': {  color: highlightColor },
    'number': {color: highlightColor },
    'boolean': { color: highlightColor },
    'variable': {  color: highlightColor },
    'class-name': { color: highlightColor },
});

const displayCode = (lines, highlightLines) => {

    const lineRefs = lines.map(() => useRef(null));
    const actualHighlightLines = highlightLines.slice(1);
    
    useEffect(() => {
        for (let lineNumber of actualHighlightLines) {
            lineRefs[lineNumber].current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [highlightLines]);

    /* 
    !Calculate the length of the longest line */
    const longestLineLength = lines.reduce((max, line) => Math.max(max, line.length), 0);
    const characterWidthEm = 0.63;
    /* Multiply by em to estimate width */
    const longestLineWidth = longestLineLength * characterWidthEm + 'em';

    const highlightColor = colorMap[highlightLines[0]];

    return (
        <div className="codeContainer" style={{ overflow: 'auto', backgroundColor: 'rgb(27, 27, 27)' }}>
            <pre style={{ display: 'inline', width: '100%' }}>
                {lines.map((line, index) => {
                    const highlighted = actualHighlightLines.includes(index);
                    const customStyle = highlighted ? highlightStyle(highlightColor) : defaultStyle;

                    /* 
                    !If the line is highlighted, set its width to the longest line width */
                    const divStyle = highlighted ? { width: longestLineWidth} : {};

                    return (
                        <div 
                            key={index} 
                            style={divStyle}
                            ref={lineRefs[index]}>
                                <SyntaxHighlighter
                                    language="java"
                                    style={customStyle}
                                    className="lineSpacing"
                                    wrapLines={true}>
                                        {line}  
                                </SyntaxHighlighter>
                        </div>
                    );
                })}
            </pre>
        </div>
    );
};

export function BubbleSortCode({ highlightLines }) {
    const bubbleSort = `!! @param A: the array
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
                /* We have swapped, so continue loop!*/
                swap(A[i], A[i + 1]);
                didSwap ← true
            }
        }
    }
}`;
    const lines = bubbleSort.split("\n");
    return displayCode(lines, highlightLines);
};

export function SelectionSortCode({ highlightLines }) {
    const selectionSort = `!! @param A: the array
!! @param n: the array length
selectionSort(A, n) {
    /* From the start to the 2nd last element. */
    /* Not the last: we have guaranteed it will be sorted */
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
}`;
    const lines = selectionSort.split("\n");
    return displayCode(lines, highlightLines)
};

export function InsertionSortCode ({ highlightLines }) {
    const insertionSort = `!! @param A: the array
!! @param n: the array length
insertionSort(A, n) {
    /* Loop until the last element */
    for (idx ← 1 to n - 1) {
        prevIdx ← idx - 1
        /* While the found element is larger than the previous */
        /* And, we haven't reached the end, keep shifting it back by 1 */
        while (prevIdx >= 0 and A[i] < A[prevIdx]) {
            swap(A[i], A[prevIdx])
            prevIdx ← prevIdx - 1
        }
    }
}`;
    const lines = insertionSort.split("\n");
    return displayCode(lines, highlightLines)
};

export function MergeSortCode ({ highlightLines }) {
    const mergeSort = `!! @param A: the array
!! @param left: the subarray's leftmost index 
!! @param right: the subarray's rightmost index 
mergeSort(A, left, right) {
    /* While our subarray is still larger than 1, split into 2 more subarrays*/
    if (left < right) {
        mid ← [(left + right)/2]
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
    split1 ← mid - left + 1
    split2 ← right - mid
    Create arrays L[0...split1] and R[0...split2]
    /* Transfer 1st half of A to L */
    for (i ← 0 to split1 - 1) {
        L[i] ← A[left + i - 1]
    }
    /* Transfer 2nd half of A to R */
    for (j ← 0 to split2 - 1) {
        R[j] ← A[mid + j]
    }
    /* Sentinal values to avoid checking if subarrays are fully copied */
    L[split1], R[split2] ← ∞, ∞
    LIdx, RIdx ← 0, 0
    /* Compare L and R elements and merge into A */
    for (mainIdx ← left to right) {
        if (L[LIdx] ≤ R[RIdx]) {
            A[mainIdx] ← L[LIdx]
            LIdx ← LIdx + 1
        } else {
            A[mainIdx] ← R[RIdx]
            RIdx ← RIdx + 1
        }
    }
}`
    const lines = mergeSort.split("\n");
    return displayCode(lines, highlightLines)
}

export function HeapSortCode ({ highlightLines }) {
    const heapSort = `!! @param A: the array, 1 based indexing
HEAPSORT(A) {
    BUILD_MAX_HEAP(A)
    heapSize(A) ← len(A)
    /* Swap n elements */
    for (i ← length(A) downto 2) {
        swap(A[1], A[i])
        heapSize(A) ← heapSize(A) - 1
        /* HEAPIFY_DOWN the swapped element */
        HEAPIFY_DOWN(A, 1)
    }
}
!! @param A: the array
!! @param idx: the index of the element being HEAPIFY_DOWNED
HEAPIFY_DOWN(A, idx) {
    /* If idx has no children (over halfway point of array) */
    if (idx * 2 > heapSize(A)) {
        return;
    }
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
    heapSize(A) ← length(A)
    /* Only HEAPIFY_DOWN the 1st half of the array: top 50% of the tree*/
    for (i ← length(A)/2 downto 1) {
        HEAPIFY_DOWN(A, i)
    }
}
`;
    const lines = heapSort.split("\n");
    return displayCode(lines, highlightLines);
};