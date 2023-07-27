export const bubbleSortCode = () => (
    <>
<pre style={{ fontSize: "12px" }}>
    <code>
{`Bubble-Sort(A, n) {
    didSwap ← true
    while (didSwap) {
        didSwap ← false
        for i ← 0 to n - 2 {
            if (A[i] > A[i + 1]) {
                swap(A[i], A[i + 1]);
                didSwap ← true
            }
        }
    }
}
`}
    </code>
</pre>
    </>
);

export const selectionSortCode = () => (
    <>
<pre style={{ fontSize: "12px" }}>
    <code>
{`Selection-Sort(A, n) {
    for i ← 0 to n - 2 {
          k ← i
          for j ← (i + 1) to n - 1 {
              if (A[j] < A[k]) {
                  k ← j
              }
          }
          if (k != j) {
              swap(A[i], A[k])
          }
    }
}
`}
    </code>
</pre>
    </>
);

export const insertionSortCode = () => (
    <>
<pre style={{ fontSize: "12px" }}>
    <code>
{`Insertion-Sort(A, n) {
    for j ← 1 to n - 1 {
          k ← A[j]
          i ← j - 1
          while (i >= 0) and (A[i] > key) {
            A[i + 1] ← A[i]
            i ← i - 1
          }
          A[i + 1] ← key
    }
}
`}
    </code>
</pre>
    </>
);

export const mergeSortCode = () => (
    <>
<pre style={{ fontSize: "12px" }}>
    <code>
{`Merge-Sort(A, left, right) {
    if left < right {
        mid ← ⌊(left + right)/2⌋
        Merge-Sort(A, left, mid)
        Merge-Sort(A, mid + 1, right)
        merge(A, left, mid, right)
    }
}

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
    </code>
</pre>
    </>
);

export const heapSortCode = () => (
    <>
<pre style={{ fontSize: "12px" }}>
    <code>
{`HEAPSORT(A) {
    BUILD-MAX-HEAP(A)

    /* Swap n elements */
    for (i ← length(A) downto 2) {
        swap(A[1], A[i])
        heap-size(A) ← heap-size(A) - 1

        /* HEAPIFY-DOWN the swapped element */
        HEAPIFY-DOWN(A, 1)
    }
}

HEAPIFY-DOWN(A, i) {
/* Determine children of node */
    LChild ← 2i
    RChild ← 2i + 1

/* Determine max of node and children */
    largestIdx ← max(A[i], A[LChild], A[RChild])

/* If the i'th node isn't the largest, we swap */
    if (largest != i) {
        swap(A[i], A[largestIdx])

        /* Continue to HEAPIFY-DOWN until larger than all its children */
        HEAPIFY-DOWN(A, largestIdx)
    }
}

BUILD-MAX-HEAP(A) {
    heap-size(A) ← length(A)

    /* HEAPIFY-DOWN only the 1st half of the array: top 50% of the tree*/
    for (i ← length(A)/2 downto 1) {
        HEAPIFY-DOWN(A, i)
    }
}
`}
    </code>
</pre>
    </>
);