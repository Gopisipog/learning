using System;
using System.Collections.Generic;
using System.Linq;

class TwoPointersEffectiveness
{
    public class ListNode
    {
        public int Value;
        public ListNode Next;
        
        public ListNode(int value)
        {
            Value = value;
            Next = null;
        }
    }
    
    static void Main()
    {
        Console.WriteLine("Two Pointers Pattern Effectiveness Demo");
        Console.WriteLine("=======================================\n");
        
        // PART 1: Two Pointers on Sorted Arrays
        Console.WriteLine("PART 1: Two Pointers on Sorted Arrays");
        Console.WriteLine("-------------------------------------");
        
        int[] sortedArray = { 1, 2, 3, 5, 8, 13, 21, 34, 55, 89 };
        Console.WriteLine("Sorted Array: " + string.Join(", ", sortedArray));
        
        // Example 1: Find pair with sum (efficient with sorted array)
        int targetSum = 63;
        Console.WriteLine($"\nExample 1: Find pair with sum = {targetSum}");
        FindPairWithSum(sortedArray, targetSum);
        
        // Example 2: Remove duplicates (efficient with sorted array)
        int[] duplicatesArray = { 0, 0, 1, 1, 1, 2, 2, 3, 3, 4 };
        Console.WriteLine("\nExample 2: Remove duplicates");
        Console.WriteLine("Original array: " + string.Join(", ", duplicatesArray));
        int uniqueCount = RemoveDuplicates(duplicatesArray);
        Console.WriteLine($"Array after removing duplicates: {string.Join(", ", duplicatesArray.Take(uniqueCount))}");
        
        // PART 2: Two Pointers on Linked Lists
        Console.WriteLine("\nPART 2: Two Pointers on Linked Lists");
        Console.WriteLine("------------------------------------");
        
        // Create a linked list: 1->2->3->4->5->6->7->8->9
        ListNode head = CreateLinkedList(new int[] { 1, 2, 3, 4, 5, 6, 7, 8, 9 });
        Console.WriteLine("Linked List: " + LinkedListToString(head));
        
        // Example 3: Find middle node (efficient with linked list)
        Console.WriteLine("\nExample 3: Find middle node");
        ListNode middle = FindMiddleNode(head);
        Console.WriteLine($"Middle node value: {middle.Value}");
        
        // Example 4: Detect cycle in linked list (efficient with linked list)
        Console.WriteLine("\nExample 4: Detect cycle in linked list");
        // Create a linked list with cycle: 1->2->3->4->5->6->7->8->9->4
        ListNode cycleHead = CreateLinkedList(new int[] { 1, 2, 3, 4, 5, 6, 7, 8, 9 });
        CreateCycle(cycleHead, 3); // Connect last node to the 4th node (index 3)
        bool hasCycle = DetectCycle(cycleHead);
        Console.WriteLine($"Has cycle: {hasCycle}");
        
        // PART 3: Why Two Pointers is less effective on other data structures
        Console.WriteLine("\nPART 3: Why Two Pointers is less effective on other data structures");
        Console.WriteLine("------------------------------------------------------------------");
        
        // Example 5: Unsorted array (requires sorting or other techniques)
        Console.WriteLine("\nExample 5: Unsorted array limitations");
        int[] unsortedArray = { 8, 4, 2, 1, 5, 7, 6, 3 };
        Console.WriteLine("Unsorted Array: " + string.Join(", ", unsortedArray));
        Console.WriteLine("Finding pair with sum in unsorted array requires either:");
        Console.WriteLine("1. Sorting first (O(n log n)) which negates the O(n) advantage of Two Pointers");
        Console.WriteLine("2. Using a hash set (not Two Pointers)");
        
        // Example 6: Hash map (not suitable for Two Pointers)
        Console.WriteLine("\nExample 6: Hash map limitations");
        Console.WriteLine("Hash maps don't have a natural linear traversal order");
        Console.WriteLine("Two Pointers relies on sequential access which hash maps don't provide");
        
        // Example 7: Tree (not suitable for Two Pointers in most cases)
        Console.WriteLine("\nExample 7: Tree limitations");
        Console.WriteLine("Trees have multiple paths and branches");
        Console.WriteLine("Two Pointers typically needs a single linear path to be effective");
        
        Console.WriteLine("\nConclusion: Two Pointers is most effective on sorted arrays and linked lists");
        Console.WriteLine("because they provide linear access patterns and natural ordering that");
        Console.WriteLine("the technique can exploit for O(n) time complexity solutions.");
    }
    
    // SORTED ARRAY EXAMPLES
    
    // Example 1: Find pair with sum in sorted array - O(n) time
    static void FindPairWithSum(int[] nums, int target)
    {
        int left = 0;
        int right = nums.Length - 1;
        
        while (left < right)
        {
            int currentSum = nums[left] + nums[right];
            
            if (currentSum == target)
            {
                Console.WriteLine($"Found pair: {nums[left]} + {nums[right]} = {target}");
                return;
            }
            else if (currentSum < target)
            {
                left++;  // Need larger values, move left pointer right
            }
            else
            {
                right--; // Need smaller values, move right pointer left
            }
        }
        
        Console.WriteLine("No pair found with the target sum");
    }
    
    // Example 2: Remove duplicates from sorted array - O(n) time
    static int RemoveDuplicates(int[] nums)
    {
        if (nums.Length == 0) return 0;
        
        int uniquePointer = 0;
        
        for (int currentPointer = 1; currentPointer < nums.Length; currentPointer++)
        {
            if (nums[currentPointer] != nums[uniquePointer])
            {
                uniquePointer++;
                nums[uniquePointer] = nums[currentPointer];
            }
        }
        
        return uniquePointer + 1;
    }
    
    // LINKED LIST EXAMPLES
    
    // Example 3: Find middle node using fast and slow pointers - O(n) time
    static ListNode FindMiddleNode(ListNode head)
    {
        if (head == null) return null;
        
        ListNode slow = head;
        ListNode fast = head;
        
        // Fast pointer moves twice as fast as slow pointer
        // When fast reaches the end, slow will be at the middle
        while (fast != null && fast.Next != null)
        {
            slow = slow.Next;
            fast = fast.Next.Next;
        }
        
        return slow;
    }
    
    // Example 4: Detect cycle in linked list using fast and slow pointers - O(n) time
    static bool DetectCycle(ListNode head)
    {
        if (head == null) return false;
        
        ListNode slow = head;
        ListNode fast = head;
        
        while (fast != null && fast.Next != null)
        {
            slow = slow.Next;
            fast = fast.Next.Next;
            
            // If slow and fast pointers meet, there's a cycle
            if (slow == fast)
                return true;
        }
        
        return false;
    }
    
    // HELPER METHODS
    
    static ListNode CreateLinkedList(int[] values)
    {
        if (values.Length == 0) return null;
        
        ListNode head = new ListNode(values[0]);
        ListNode current = head;
        
        for (int i = 1; i < values.Length; i++)
        {
            current.Next = new ListNode(values[i]);
            current = current.Next;
        }
        
        return head;
    }
    
    static void CreateCycle(ListNode head, int position)
    {
        if (head == null) return;
        
        ListNode tail = head;
        while (tail.Next != null)
        {
            tail = tail.Next;
        }
        
        ListNode cycleNode = head;
        for (int i = 0; i < position; i++)
        {
            if (cycleNode == null) return;
            cycleNode = cycleNode.Next;
        }
        
        tail.Next = cycleNode;
    }
    
    static string LinkedListToString(ListNode head)
    {
        if (head == null) return "empty";
        
        List<int> values = new List<int>();
        ListNode current = head;
        int count = 0;
        const int maxNodes = 20; // Prevent infinite loop for cyclic lists
        
        while (current != null && count < maxNodes)
        {
            values.Add(current.Value);
            current = current.Next;
            count++;
        }
        
        return string.Join("->", values) + (count >= maxNodes ? "->..." : "");
    }
}