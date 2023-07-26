import '../../../src/App.css';
export const introDescription = () => (
    <>
        <h5><strong>Data Structure & Algorithm Visualizer</strong></h5>
        <br />
        <p> This is DSAV. We're all about helping you learn
            a little easier. We've got
            you covered with cool animations to visualize what actually
            going on behind the algorithms you learn.

            <br /><br />Learn at your own pace with the tools below. Play, pause,
            change the speed, length...etc

            <br /><br />We've got plans to add more data
            structures for you to visualize:
        </p>
        <li> Arrays, Stacks, Queues, Linked Lists</li>
        <li> Trees, Heaps, Graphs </li> <br />
        <p> So, stay updated, and we'll keep you covered!</p>
    </>
);

export const bubbleDescription = () => (
    <>
        <p>
            <h5><strong>Bubble Sort:</strong></h5>
            A straightforward sorting algorithm that <br />
            repeatedly compares adjacent elements in a list <br />
            and swaps them if they are in the wrong order. <br />
            This process continues until the list is sorted.<br /><br />
            <h6><strong>Time Complexity:</strong></h6>
        </p>,
        <ul>
            <li> Best Case: Ω(n) — the list is already sorted, <br />
                so no swaps are needed. The list <br />
                is traversed n times, where we have n <br />
                elements.
            </li>
            <li> Average Case: O(n<sup>2</sup>) — the algorithm <br />
                makes n<sup>2</sup>/2 comparisons.
            </li>
            <li> Worst Case: O(n<sup>2</sup>) — the list is in <br />
                reverse order, requiring the n iterations <br />
                and (n - 1), (n - 2)... 1 comparisons & swaps.
            </li>
        </ul>,
        <h6><strong>Space Complexity:</strong></h6>,
        <p>O(1) — Bubble Sort sorts the list in place without requiring additional memory.</p>
    </>
);

export const selectionDescription = () => (
    <>
        <p>
            <h5><strong>Selection Sort:</strong></h5>
            An easy-top-implement sorting algorithm that 
            repeatedly finds the smallest element 
            from the unsorted part of the list and swaps it 
            with the first unsorted element. <br />
        </p>,
        <h6><strong>Time Complexity:</strong></h6>,
        <ul>
            <li> All Cases: θ(n<sup>2</sup>)</li>
            <li>
                In every possible iteration, unsorted or
                sorted, the the algorithm makes n(n-1)/2 
                comparisons, which simplifies to O(n<sup>2</sup>).
            </li>
            <li>
                This is because in any case, we have no knowledge of where the next minimum is
            </li>
        </ul>,
        <h6><strong>Space Complexity:</strong></h6>,
        <p>O(1) — Selection Sort sorts the list in place
            without requiring additional memory.</p>
    </>
);

export const insertionDescription = () => (
    <>
        <p>
            <h5><strong>Insertion Sort:</strong></h5>
            We build a sorted list one element at a time. <br />
            Each iteration removes one element from <br />
            the input data, finds the location it belongs <br />
            within the sorted list, and inserts it there. <br /><br />
            <h6><strong>Time Complexity:</strong></h6>
        </p>,
        <ul>
            <li> Best Case: Ω(n) — when the list is sorted,<br />
                the algorithm only passes through the list <br />
                once, n times for n elements.
            </li>
            <li> Average-case: θ(n<sup>2</sup>) — On average, the algorithm makes quadratic number of comparisons.
            </li>
            <li> Worst-case: θ(n<sup>2</sup>) — In the worst-case <br />
                scenario (when the list is in reverse order), <br /> the
                algorithm makes a quadratic <br />
                number of comparisons.
            </li>
        </ul>,
        <h6><strong>Space Complexity:</strong></h6>,
        <p>O(1) — Insertion Sort sorts the list in place without requiring additional memory.</p>
    </>
);

export const mergeDescription = () => (
    <>
        <p>
            <h5><strong>Merge Sort:</strong></h5>
            is a divide and conquer algorithm that divides the <br />
            input array into two halves, sorts them and then merges the two sorted halves. <br /><br />
            <h6><strong>Time Complexity:</strong></h6>
        </p>,
        <ul>
            <li> All Cases: Ω(nlog(n))</li>
            <li>
                In every possible scenario, when the list is sorted,
                or when it is not, the list always <br />
                performs a linearaithmic number of <br />
                operations
            </li>
        </ul>,
        <h6><strong>Space Complexity:</strong></h6>,
        <p>O(n) — Merge Sort is not an in-place algorithm <br />
            and requires extra space: our auxiliary array is of
            <br /> n elements.</p>
    </>
);

export const heapDescription = () => (
    <>
        <p>
            <h5><strong>Heap Sort:</strong></h5>
            A sorting algorithm based on a <br />
            Max Binary-Heap. We build a max heap, and, <br />
            swapping the root element with the end element, <br />
            reduce the heap size by one. <br /><br />
            <h6><strong>Time Complexity:</strong></h6>
        </p>,
        <ul>
            <li> All Cases: θ(n log n)</li>
            <li> In all scenarios, making a max-heap is θ(n). <br />
                The subsequent steps swap the end and <br />
                root for n elements, and HEAPIFY-DOWN <br />
                for those n elements.
            </li>
        </ul>,
        <h6><strong>Space Complexity:</strong></h6>,
        <p>O(1) — Heap Sort is an in-place sorting algorithm <br />
            since the MAX-HEAP is used from our original <br />
            array.</p>
    </>
);