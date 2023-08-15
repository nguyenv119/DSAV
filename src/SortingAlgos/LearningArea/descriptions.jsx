import '../../Styles/App.css';
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
            Repeatedly swaps adjacent elements
            if wrongly ordered,  <i><u>bubbling</u></i> up, until sorted<br /><br />
            <h6><strong>Time Complexity:</strong></h6>
        </p>
        <ul>
            <li> Best Case: Ω(n) — a sorted list,
                so no swaps are needed. The list
                is traversed n times, for n
                elements.
            </li>
            <li> Average Case: O(n<sup>2</sup>) — the algorithm
                makes n<sup>2</sup>/2 comparisons.
            </li>
            <li> Worst Case: O(n<sup>2</sup>) — the list is
                reversely-sorted, requiring the n iterations
                and (n - 1), (n - 2)...1 comparisons & swaps.
            </li>
        </ul>
        <h6><strong>Space Complexity:</strong></h6>
        <p>θ(1) — Sorts the list in-place without requiring additional storage.</p>
    </>
);

export const selectionDescription = () => (
    <>
        <p>
            <h5><strong>Selection Sort:</strong></h5>
            Repeatedly <i><u>selects</u></i> the smallest element from the unsorted segment of the list, 
            and then swaps it with the first unsorted item. <br />
        </p>
        <h6><strong>Time Complexity:</strong></h6>
        <ul>
            <li> All Cases: θ(n<sup>2</sup>)</li>
            <li>
                Tthe algorithm always makes n(n-1)/2 comparisons: O(n<sup>2</sup>).
            </li>
            <li>
                Without any additional knowledge, 
                we cannot determine where the next minimum value will be in the unsorted part of the list.
            </li>
        </ul>
        <h6><strong>Space Complexity:</strong></h6>
        <p>θ(1) — Sorts the list in-place without requiring additional storage.</p>
    </>
);

export const insertionDescription = () => (
    <>
        <p>
            <h5><strong>Insertion Sort:</strong></h5>
            Each iteration removes elements from
            the unsorted array, finds the location it belongs
            within the sorted part, and inserts it there. <br /><br />
            <h6><strong>Time Complexity:</strong></h6>
        </p>
        <ul>
            <li> Best Case: Ω(n) — a sorted list: each element is
                already in its correct spot. The algorithm only passes the list 
                n times for n elements, and sees no swaps.
            </li>
            <li> Average-case: θ(n<sup>2</sup>) — the algorithm makes quadratic number of comparisons.
            </li>
            <li> Worst-case: θ(n<sup>2</sup>) — The list is in reverse order: going through
            the list and swapping each consecutive element 1, 2...n - 1, n times: a quadratic number of comparisons.
            </li>
        </ul>
        <h6><strong>Space Complexity:</strong></h6>
        <p>θ(1) — Sorts the list in-place without requiring additional storage.</p>
    </>
);

export const mergeDescription = () => (
    <div style={{ lineHeight: "1.2" }}>
        <p>
            <h5><strong>Merge Sort:</strong></h5>
            A divide and conquer algorithm that divides the
            input array into two halves, sorts them and then merges the two sorted halves.
        </p>
        <h6 style={{ marginBottom: "0.5em" }}><strong>Time Complexity:</strong></h6>
        <ul style={{ marginTop: "0.5em" }}>
            <li>All Cases: θ(nlog(n)) — the list
                performs a linearaithmic number of
                operations
            </li>
        </ul>
        <h6><strong>Space Complexity:</strong></h6>
        <p>θ(n) — Requires extra space: auxiliary array of
            n elements.</p>
    </div>
);

export const heapDescription = () => (
    <>
        <p>
            <h5><strong>Heap Sort:</strong></h5>
            Build a max heap, and for 
            n elements, swap the root with the end & reduce the heap size by 1 each time. 
            Sorting is done in the swapping. <br /><br />
            <h6><strong>Time Complexity:</strong></h6>
        </p>
        <ul>
            {/* <li> All Cases: θ(nlog(n))</li> */}
            <li> Building a Max-Heap: θ(n).
                Swapping ends and HEAPIFY-DOWN: O(log(n)) — for n elements: θ(nlog(n)). 
                <br />So, θ(nlog(n) + n) = θ(nlog(n))
            </li>
        </ul>
        <h6><strong>Space Complexity:</strong></h6>
        <p>O(1) — an in-place algorithm: the MAX-HEAP is our original array.
        </p>
    </>
);