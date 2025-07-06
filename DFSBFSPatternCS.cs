using System;
using System.Collections.Generic;
using System.Linq;

namespace CodingPatterns
{
    /// <summary>
    /// Comprehensive DFS/BFS Pattern Implementation
    /// Educational focus: Graph traversal, tree problems, connected components
    /// </summary>
    public class DFSBFSPatternCS
    {
        public static void Main(string[] args)
        {
            Console.WriteLine("🌳 DFS/BFS Pattern - C# Implementation");
            Console.WriteLine("=" * 50);
            
            var demo = new DFSBFSPatternCS();
            demo.RunAllDemonstrations();
        }

        public void RunAllDemonstrations()
        {
            Console.WriteLine("\n📚 EDUCATIONAL OVERVIEW:");
            Console.WriteLine("DFS: Depth-First Search - explores as far as possible before backtracking");
            Console.WriteLine("BFS: Breadth-First Search - explores all neighbors before going deeper");
            Console.WriteLine("DFS: Stack (recursive/iterative), BFS: Queue");
            
            // Tree Problems
            DemonstrateTreeTraversal();
            DemonstrateMaxDepth();
            DemonstratePathSum();
            
            // Graph Problems
            DemonstrateNumberOfIslands();
            DemonstrateCloneGraph();
            DemonstrateCourseSchedule();
        }

        #region Tree Node Definition
        public class TreeNode
        {
            public int val;
            public TreeNode left;
            public TreeNode right;
            public TreeNode(int val = 0, TreeNode left = null, TreeNode right = null)
            {
                this.val = val;
                this.left = left;
                this.right = right;
            }
        }
        #endregion

        #region Problem 1: Tree Traversal (DFS variations)
        /// <summary>
        /// Demonstrate different DFS traversal methods
        /// Pseudocode for Inorder:
        /// 1. Recursively traverse left subtree
        /// 2. Process current node
        /// 3. Recursively traverse right subtree
        /// </summary>
        public void DemonstrateTreeTraversal()
        {
            Console.WriteLine("\n🔍 Problem 1: Tree Traversal (DFS Variations)");
            
            // Create sample tree:     1
            //                       /   \
            //                      2     3
            //                     / \
            //                    4   5
            TreeNode root = new TreeNode(1);
            root.left = new TreeNode(2);
            root.right = new TreeNode(3);
            root.left.left = new TreeNode(4);
            root.left.right = new TreeNode(5);
            
            Console.WriteLine("Tree structure:");
            Console.WriteLine("      1");
            Console.WriteLine("     / \\");
            Console.WriteLine("    2   3");
            Console.WriteLine("   / \\");
            Console.WriteLine("  4   5");
            
            var inorder = InorderTraversal(root);
            var preorder = PreorderTraversal(root);
            var postorder = PostorderTraversal(root);
            var levelorder = LevelOrderTraversal(root);
            
            Console.WriteLine($"\n✅ Inorder (Left-Root-Right): [{string.Join(", ", inorder)}]");
            Console.WriteLine($"✅ Preorder (Root-Left-Right): [{string.Join(", ", preorder)}]");
            Console.WriteLine($"✅ Postorder (Left-Right-Root): [{string.Join(", ", postorder)}]");
            Console.WriteLine($"✅ Level Order (BFS): [{string.Join(", ", levelorder)}]");
        }

        public IList<int> InorderTraversal(TreeNode root)
        {
            var result = new List<int>();
            InorderHelper(root, result);
            return result;
        }

        private void InorderHelper(TreeNode node, IList<int> result)
        {
            if (node == null) return;
            
            InorderHelper(node.left, result);   // Left
            result.Add(node.val);               // Root
            InorderHelper(node.right, result);  // Right
        }

        public IList<int> PreorderTraversal(TreeNode root)
        {
            var result = new List<int>();
            PreorderHelper(root, result);
            return result;
        }

        private void PreorderHelper(TreeNode node, IList<int> result)
        {
            if (node == null) return;
            
            result.Add(node.val);               // Root
            PreorderHelper(node.left, result);  // Left
            PreorderHelper(node.right, result); // Right
        }

        public IList<int> PostorderTraversal(TreeNode root)
        {
            var result = new List<int>();
            PostorderHelper(root, result);
            return result;
        }

        private void PostorderHelper(TreeNode node, IList<int> result)
        {
            if (node == null) return;
            
            PostorderHelper(node.left, result);  // Left
            PostorderHelper(node.right, result); // Right
            result.Add(node.val);                // Root
        }

        public IList<IList<int>> LevelOrderTraversal(TreeNode root)
        {
            var result = new List<IList<int>>();
            if (root == null) return result;
            
            var queue = new Queue<TreeNode>();
            queue.Enqueue(root);
            
            while (queue.Count > 0)
            {
                int levelSize = queue.Count;
                var currentLevel = new List<int>();
                
                for (int i = 0; i < levelSize; i++)
                {
                    TreeNode node = queue.Dequeue();
                    currentLevel.Add(node.val);
                    
                    if (node.left != null) queue.Enqueue(node.left);
                    if (node.right != null) queue.Enqueue(node.right);
                }
                
                result.Add(currentLevel);
            }
            
            return result;
        }
        #endregion

        #region Problem 2: Maximum Depth of Binary Tree
        /// <summary>
        /// Find maximum depth using DFS
        /// Pseudocode:
        /// 1. If node is null: return 0
        /// 2. Recursively find depth of left and right subtrees
        /// 3. Return 1 + max(leftDepth, rightDepth)
        /// </summary>
        public void DemonstrateMaxDepth()
        {
            Console.WriteLine("\n🔍 Problem 2: Maximum Depth of Binary Tree");
            
            TreeNode root = new TreeNode(3);
            root.left = new TreeNode(9);
            root.right = new TreeNode(20);
            root.right.left = new TreeNode(15);
            root.right.right = new TreeNode(7);
            
            int depth = MaxDepth(root);
            Console.WriteLine($"✅ Maximum depth: {depth}");
            
            Console.WriteLine("\n💡 DFS approach: Recursively explore all paths");
        }

        public int MaxDepth(TreeNode root)
        {
            if (root == null) return 0;
            
            int leftDepth = MaxDepth(root.left);
            int rightDepth = MaxDepth(root.right);
            
            return 1 + Math.Max(leftDepth, rightDepth);
        }
        #endregion

        #region Problem 3: Path Sum
        /// <summary>
        /// Check if there's a root-to-leaf path with given sum
        /// Pseudocode:
        /// 1. If node is null: return false
        /// 2. If leaf node: check if remaining sum equals node value
        /// 3. Recursively check left and right subtrees with updated sum
        /// 4. Return true if any path has the target sum
        /// </summary>
        public void DemonstratePathSum()
        {
            Console.WriteLine("\n🔍 Problem 3: Path Sum");
            
            TreeNode root = new TreeNode(5);
            root.left = new TreeNode(4);
            root.right = new TreeNode(8);
            root.left.left = new TreeNode(11);
            root.left.left.left = new TreeNode(7);
            root.left.left.right = new TreeNode(2);
            root.right.left = new TreeNode(13);
            root.right.right = new TreeNode(4);
            root.right.right.right = new TreeNode(1);
            
            int targetSum = 22;
            bool hasPath = HasPathSum(root, targetSum);
            
            Console.WriteLine($"Target sum: {targetSum}");
            Console.WriteLine($"✅ Has path with sum {targetSum}: {hasPath}");
        }

        public bool HasPathSum(TreeNode root, int targetSum)
        {
            if (root == null) return false;
            
            // If leaf node, check if remaining sum equals node value
            if (root.left == null && root.right == null)
            {
                return targetSum == root.val;
            }
            
            // Recursively check left and right subtrees
            int remainingSum = targetSum - root.val;
            return HasPathSum(root.left, remainingSum) || HasPathSum(root.right, remainingSum);
        }
        #endregion

        #region Problem 4: Number of Islands (DFS on Grid)
        /// <summary>
        /// Count number of islands in 2D grid using DFS
        /// Pseudocode:
        /// 1. Iterate through each cell in grid
        /// 2. If cell is '1' (land): start DFS to mark entire island
        /// 3. DFS marks all connected land cells as visited
        /// 4. Increment island count for each new island found
        /// 5. Return total count
        /// </summary>
        public void DemonstrateNumberOfIslands()
        {
            Console.WriteLine("\n🔍 Problem 4: Number of Islands (DFS on Grid)");
            
            char[,] grid = {
                {'1','1','1','1','0'},
                {'1','1','0','1','0'},
                {'1','1','0','0','0'},
                {'0','0','0','0','0'}
            };
            
            Console.WriteLine("Grid (1=land, 0=water):");
            PrintGrid(grid);
            
            int islands = NumIslands(grid);
            Console.WriteLine($"✅ Number of islands: {islands}");
        }

        public int NumIslands(char[,] grid)
        {
            if (grid == null) return 0;
            
            int rows = grid.GetLength(0);
            int cols = grid.GetLength(1);
            int numIslands = 0;
            
            for (int i = 0; i < rows; i++)
            {
                for (int j = 0; j < cols; j++)
                {
                    if (grid[i, j] == '1')
                    {
                        numIslands++;
                        DFSMarkIsland(grid, i, j, rows, cols);
                    }
                }
            }
            
            return numIslands;
        }

        private void DFSMarkIsland(char[,] grid, int i, int j, int rows, int cols)
        {
            // Boundary check and water check
            if (i < 0 || i >= rows || j < 0 || j >= cols || grid[i, j] == '0')
            {
                return;
            }
            
            // Mark current cell as visited
            grid[i, j] = '0';
            
            // DFS in all 4 directions
            DFSMarkIsland(grid, i + 1, j, rows, cols); // Down
            DFSMarkIsland(grid, i - 1, j, rows, cols); // Up
            DFSMarkIsland(grid, i, j + 1, rows, cols); // Right
            DFSMarkIsland(grid, i, j - 1, rows, cols); // Left
        }

        private void PrintGrid(char[,] grid)
        {
            int rows = grid.GetLength(0);
            int cols = grid.GetLength(1);
            
            for (int i = 0; i < rows; i++)
            {
                Console.Write("  [");
                for (int j = 0; j < cols; j++)
                {
                    Console.Write(grid[i, j]);
                    if (j < cols - 1) Console.Write(", ");
                }
                Console.WriteLine("]");
            }
        }
        #endregion

        #region Problem 5: Clone Graph (DFS with HashMap)
        public class Node
        {
            public int val;
            public IList<Node> neighbors;
            
            public Node()
            {
                val = 0;
                neighbors = new List<Node>();
            }
            
            public Node(int _val)
            {
                val = _val;
                neighbors = new List<Node>();
            }
        }

        /// <summary>
        /// Clone an undirected graph using DFS
        /// Pseudocode:
        /// 1. Use HashMap to track original -> clone mapping
        /// 2. DFS through graph starting from given node
        /// 3. For each node: create clone if not exists
        /// 4. Recursively clone all neighbors
        /// 5. Return cloned graph
        /// </summary>
        public void DemonstrateCloneGraph()
        {
            Console.WriteLine("\n🔍 Problem 5: Clone Graph (DFS with HashMap)");
            
            // Create sample graph: 1-2-4
            //                       |   |
            //                       3---+
            Node node1 = new Node(1);
            Node node2 = new Node(2);
            Node node3 = new Node(3);
            Node node4 = new Node(4);
            
            node1.neighbors.Add(node2);
            node1.neighbors.Add(node3);
            node2.neighbors.Add(node1);
            node2.neighbors.Add(node4);
            node3.neighbors.Add(node1);
            node3.neighbors.Add(node4);
            node4.neighbors.Add(node2);
            node4.neighbors.Add(node3);
            
            Node clonedGraph = CloneGraph(node1);
            Console.WriteLine($"✅ Graph cloned successfully");
            Console.WriteLine("Original and clone are separate objects with same structure");
        }

        public Node CloneGraph(Node node)
        {
            if (node == null) return null;
            
            var visited = new Dictionary<Node, Node>();
            return DFSClone(node, visited);
        }

        private Node DFSClone(Node node, Dictionary<Node, Node> visited)
        {
            if (visited.ContainsKey(node))
            {
                return visited[node];
            }
            
            // Create clone of current node
            Node clone = new Node(node.val);
            visited[node] = clone;
            
            // Clone all neighbors
            foreach (Node neighbor in node.neighbors)
            {
                clone.neighbors.Add(DFSClone(neighbor, visited));
            }
            
            return clone;
        }
        #endregion

        #region Problem 6: Course Schedule (Cycle Detection with DFS)
        /// <summary>
        /// Determine if all courses can be finished (detect cycle in directed graph)
        /// Pseudocode:
        /// 1. Build adjacency list from prerequisites
        /// 2. Use DFS with three states: unvisited, visiting, visited
        /// 3. If we encounter a node in "visiting" state: cycle detected
        /// 4. Return true if no cycles found
        /// </summary>
        public void DemonstrateCourseSchedule()
        {
            Console.WriteLine("\n🔍 Problem 6: Course Schedule (Cycle Detection)");
            
            int numCourses = 4;
            int[][] prerequisites = {
                new int[] {1, 0},
                new int[] {2, 1},
                new int[] {3, 2}
            };
            
            Console.WriteLine($"Number of courses: {numCourses}");
            Console.WriteLine("Prerequisites: [course, prerequisite]");
            foreach (var prereq in prerequisites)
            {
                Console.WriteLine($"  Course {prereq[0]} requires Course {prereq[1]}");
            }
            
            bool canFinish = CanFinish(numCourses, prerequisites);
            Console.WriteLine($"✅ Can finish all courses: {canFinish}");
        }

        public bool CanFinish(int numCourses, int[][] prerequisites)
        {
            // Build adjacency list
            var graph = new List<int>[numCourses];
            for (int i = 0; i < numCourses; i++)
            {
                graph[i] = new List<int>();
            }
            
            foreach (var prereq in prerequisites)
            {
                graph[prereq[1]].Add(prereq[0]); // prereq[1] -> prereq[0]
            }
            
            // 0: unvisited, 1: visiting, 2: visited
            var state = new int[numCourses];
            
            for (int i = 0; i < numCourses; i++)
            {
                if (state[i] == 0 && HasCycleDFS(graph, i, state))
                {
                    return false; // Cycle detected
                }
            }
            
            return true; // No cycle
        }

        private bool HasCycleDFS(List<int>[] graph, int course, int[] state)
        {
            if (state[course] == 1) return true;  // Cycle detected
            if (state[course] == 2) return false; // Already processed
            
            state[course] = 1; // Mark as visiting
            
            foreach (int nextCourse in graph[course])
            {
                if (HasCycleDFS(graph, nextCourse, state))
                {
                    return true;
                }
            }
            
            state[course] = 2; // Mark as visited
            return false;
        }
        #endregion
    }
}
