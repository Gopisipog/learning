using System;
using System.Collections.Generic;

class CycleVisualization
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
        Console.WriteLine("Visualizing the CreateCycle Function");
        Console.WriteLine("===================================\n");
        
        // Create a regular linked list: 1->2->3->4->5->6->7->8->9
        ListNode head = CreateLinkedList(new int[] { 1, 2, 3, 4, 5, 6, 7, 8, 9 });
        
        Console.WriteLine("Original Linked List (no cycle):");
        Console.WriteLine("-------------------------------");
        VisualizeList(head);
        
        // Create a cycle by connecting the last node to the 4th node (index 3)
        Console.WriteLine("\nCreating a cycle by connecting the last node (9) to the 4th node (4)...");
        CreateCycle(head, 3);
        
        Console.WriteLine("\nLinked List after CreateCycle(head, 3):");
        Console.WriteLine("---------------------------------------");
        VisualizeListWithCycle(head);
        
        // Demonstrate with different position
        ListNode head2 = CreateLinkedList(new int[] { 1, 2, 3, 4, 5 });
        Console.WriteLine("\n\nAnother example with a shorter list:");
        Console.WriteLine("------------------------------------");
        Console.WriteLine("Original Linked List (no cycle):");
        VisualizeList(head2);
        
        // Create a cycle by connecting the last node to the 2nd node (index 1)
        Console.WriteLine("\nCreating a cycle by connecting the last node (5) to the 2nd node (2)...");
        CreateCycle(head2, 1);
        
        Console.WriteLine("\nLinked List after CreateCycle(head2, 1):");
        Console.WriteLine("----------------------------------------");
        VisualizeListWithCycle(head2);
    }
    
    // Creates a cycle in the linked list by connecting the last node to the node at position
    static void CreateCycle(ListNode head, int position)
    {
        if (head == null) return;
        
        // Step 1: Find the tail node (the last node in the list)
        ListNode tail = head;
        while (tail.Next != null)
        {
            tail = tail.Next;
        }
        
        // Step 2: Find the node at the specified position
        ListNode cycleNode = head;
        for (int i = 0; i < position; i++)
        {
            if (cycleNode == null) return;
            cycleNode = cycleNode.Next;
        }
        
        // Step 3: Connect the tail to the node at position, creating a cycle
        tail.Next = cycleNode;
    }
    
    // Helper method to create a linked list from an array
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
    
    // Visualize a regular linked list
    static void VisualizeList(ListNode head)
    {
        if (head == null)
        {
            Console.WriteLine("Empty list");
            return;
        }
        
        // Print the list as a chain
        ListNode current = head;
        while (current != null)
        {
            Console.Write(current.Value);
            if (current.Next != null)
                Console.Write(" -> ");
            current = current.Next;
        }
        Console.WriteLine(" -> null");
        
        // Print as a diagram
        Console.WriteLine("\nDiagram:");
        current = head;
        while (current != null)
        {
            Console.WriteLine($"[{current.Value}] --> {(current.Next != null ? current.Next.Value.ToString() : "null")}");
            current = current.Next;
        }
    }
    
    // Visualize a linked list with a cycle (safely)
    static void VisualizeListWithCycle(ListNode head)
    {
        if (head == null)
        {
            Console.WriteLine("Empty list");
            return;
        }
        
        // Use a HashSet to detect the cycle
        HashSet<ListNode> visited = new HashSet<ListNode>();
        ListNode current = head;
        
        // Print the list as a chain until we detect a cycle
        Console.Write("Chain representation: ");
        while (current != null)
        {
            Console.Write(current.Value);
            
            if (visited.Contains(current.Next))
            {
                Console.Write($" -> {current.Next.Value} (cycles back)");
                break;
            }
            
            visited.Add(current);
            
            if (current.Next != null)
                Console.Write(" -> ");
            
            current = current.Next;
        }
        Console.WriteLine();
        
        // Print as a diagram
        Console.WriteLine("\nDiagram:");
        visited.Clear();
        current = head;
        
        while (current != null && !visited.Contains(current))
        {
            visited.Add(current);
            Console.WriteLine($"[{current.Value}] --> {current.Next.Value}");
            current = current.Next;
        }
        
        if (current != null)
        {
            Console.WriteLine($"[{current.Value}] --> {current.Next.Value} (cycles back)");
        }
        
        // Visual ASCII art representation
        Console.WriteLine("\nASCII Art Representation:");
        Console.WriteLine("1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7 -> 8 -> 9");
        Console.WriteLine("              ^                         |");
        Console.WriteLine("              |                         |");
        Console.WriteLine("              +-------------------------+");
    }
}