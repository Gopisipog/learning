using System;
using System.Collections.Generic;
using System.Linq;

namespace CodingPatterns
{
    /// <summary>
    /// Comprehensive Backtracking Pattern Implementation
    /// Educational focus: Systematic exploration with pruning, decision trees
    /// </summary>
    public class BacktrackingPatternCS
    {
        public static void Main(string[] args)
        {
            Console.WriteLine("🔄 Backtracking Pattern - C# Implementation");
            Console.WriteLine("=" * 50);
            
            var demo = new BacktrackingPatternCS();
            demo.RunAllDemonstrations();
        }

        public void RunAllDemonstrations()
        {
            Console.WriteLine("\n📚 EDUCATIONAL OVERVIEW:");
            Console.WriteLine("Backtracking: Systematic way to explore all possible solutions");
            Console.WriteLine("Key steps: Choose → Explore → Unchoose (backtrack)");
            Console.WriteLine("Use when: Need to find all solutions or optimal solution");
            
            // Classic Backtracking Problems
            DemonstratePermutations();
            DemonstrateCombinations();
            DemonstrateSubsets();
            DemonstrateNQueens();
            DemonstrateSudokuSolver();
            DemonstrateWordSearch();
        }

        #region Problem 1: Generate All Permutations
        /// <summary>
        /// Generate all permutations of given array
        /// Pseudocode:
        /// 1. If current permutation is complete: add to result
        /// 2. For each unused element:
        ///    - Add element to current permutation
        ///    - Recursively generate remaining permutations
        ///    - Remove element (backtrack)
        /// </summary>
        public void DemonstratePermutations()
        {
            Console.WriteLine("\n🔍 Problem 1: Generate All Permutations");
            int[] nums = { 1, 2, 3 };
            
            Console.WriteLine($"Array: [{string.Join(", ", nums)}]");
            
            var permutations = Permute(nums);
            Console.WriteLine($"✅ Total permutations: {permutations.Count}");
            
            foreach (var perm in permutations)
            {
                Console.WriteLine($"  [{string.Join(", ", perm)}]");
            }
            
            Console.WriteLine("\n💡 Backtracking: Choose → Explore → Unchoose");
        }

        public IList<IList<int>> Permute(int[] nums)
        {
            var result = new List<IList<int>>();
            var currentPermutation = new List<int>();
            var used = new bool[nums.Length];
            
            BacktrackPermutations(nums, currentPermutation, used, result);
            return result;
        }

        private void BacktrackPermutations(int[] nums, List<int> current, bool[] used, IList<IList<int>> result)
        {
            // Base case: permutation is complete
            if (current.Count == nums.Length)
            {
                result.Add(new List<int>(current)); // Make a copy
                return;
            }
            
            // Try each unused number
            for (int i = 0; i < nums.Length; i++)
            {
                if (used[i]) continue; // Skip if already used
                
                // Choose
                current.Add(nums[i]);
                used[i] = true;
                
                // Explore
                BacktrackPermutations(nums, current, used, result);
                
                // Unchoose (backtrack)
                current.RemoveAt(current.Count - 1);
                used[i] = false;
            }
        }
        #endregion

        #region Problem 2: Generate Combinations
        /// <summary>
        /// Generate all combinations of k numbers from 1 to n
        /// Pseudocode:
        /// 1. If combination size equals k: add to result
        /// 2. For each number from start to n:
        ///    - Add number to current combination
        ///    - Recursively generate with next start position
        ///    - Remove number (backtrack)
        /// </summary>
        public void DemonstrateCombinations()
        {
            Console.WriteLine("\n🔍 Problem 2: Generate Combinations");
            int n = 4, k = 2;
            
            Console.WriteLine($"Generate combinations of {k} numbers from 1 to {n}");
            
            var combinations = Combine(n, k);
            Console.WriteLine($"✅ Total combinations: {combinations.Count}");
            
            foreach (var combo in combinations)
            {
                Console.WriteLine($"  [{string.Join(", ", combo)}]");
            }
        }

        public IList<IList<int>> Combine(int n, int k)
        {
            var result = new List<IList<int>>();
            var currentCombination = new List<int>();
            
            BacktrackCombinations(1, n, k, currentCombination, result);
            return result;
        }

        private void BacktrackCombinations(int start, int n, int k, List<int> current, IList<IList<int>> result)
        {
            // Base case: combination is complete
            if (current.Count == k)
            {
                result.Add(new List<int>(current));
                return;
            }
            
            // Try each number from start to n
            for (int i = start; i <= n; i++)
            {
                // Choose
                current.Add(i);
                
                // Explore (next start is i+1 to avoid duplicates)
                BacktrackCombinations(i + 1, n, k, current, result);
                
                // Unchoose (backtrack)
                current.RemoveAt(current.Count - 1);
            }
        }
        #endregion

        #region Problem 3: Generate All Subsets
        /// <summary>
        /// Generate all possible subsets (power set)
        /// Pseudocode:
        /// 1. For each element: decide to include or exclude
        /// 2. Add current subset to result
        /// 3. For each remaining element:
        ///    - Include element and recurse
        ///    - Exclude element (backtrack)
        /// </summary>
        public void DemonstrateSubsets()
        {
            Console.WriteLine("\n🔍 Problem 3: Generate All Subsets (Power Set)");
            int[] nums = { 1, 2, 3 };
            
            Console.WriteLine($"Array: [{string.Join(", ", nums)}]");
            
            var subsets = Subsets(nums);
            Console.WriteLine($"✅ Total subsets: {subsets.Count} (2^{nums.Length})");
            
            foreach (var subset in subsets)
            {
                Console.WriteLine($"  [{string.Join(", ", subset)}]");
            }
        }

        public IList<IList<int>> Subsets(int[] nums)
        {
            var result = new List<IList<int>>();
            var currentSubset = new List<int>();
            
            BacktrackSubsets(nums, 0, currentSubset, result);
            return result;
        }

        private void BacktrackSubsets(int[] nums, int start, List<int> current, IList<IList<int>> result)
        {
            // Add current subset to result
            result.Add(new List<int>(current));
            
            // Try including each remaining element
            for (int i = start; i < nums.Length; i++)
            {
                // Choose
                current.Add(nums[i]);
                
                // Explore
                BacktrackSubsets(nums, i + 1, current, result);
                
                // Unchoose (backtrack)
                current.RemoveAt(current.Count - 1);
            }
        }
        #endregion

        #region Problem 4: N-Queens
        /// <summary>
        /// Place N queens on NxN chessboard so none attack each other
        /// Pseudocode:
        /// 1. Try placing queen in each column of current row
        /// 2. Check if placement is safe (no conflicts)
        /// 3. If safe: place queen and recurse to next row
        /// 4. If all rows filled: found solution
        /// 5. Backtrack: remove queen and try next position
        /// </summary>
        public void DemonstrateNQueens()
        {
            Console.WriteLine("\n🔍 Problem 4: N-Queens Problem");
            int n = 4;
            
            Console.WriteLine($"Place {n} queens on {n}x{n} board");
            
            var solutions = SolveNQueens(n);
            Console.WriteLine($"✅ Total solutions: {solutions.Count}");
            
            if (solutions.Count > 0)
            {
                Console.WriteLine("\nFirst solution:");
                PrintChessboard(solutions[0]);
            }
        }

        public IList<IList<string>> SolveNQueens(int n)
        {
            var result = new List<IList<string>>();
            var board = new char[n][];
            
            // Initialize board
            for (int i = 0; i < n; i++)
            {
                board[i] = new char[n];
                Array.Fill(board[i], '.');
            }
            
            BacktrackNQueens(board, 0, result);
            return result;
        }

        private void BacktrackNQueens(char[][] board, int row, IList<IList<string>> result)
        {
            int n = board.Length;
            
            // Base case: all queens placed
            if (row == n)
            {
                var solution = new List<string>();
                foreach (var r in board)
                {
                    solution.Add(new string(r));
                }
                result.Add(solution);
                return;
            }
            
            // Try placing queen in each column of current row
            for (int col = 0; col < n; col++)
            {
                if (IsSafe(board, row, col))
                {
                    // Choose
                    board[row][col] = 'Q';
                    
                    // Explore
                    BacktrackNQueens(board, row + 1, result);
                    
                    // Unchoose (backtrack)
                    board[row][col] = '.';
                }
            }
        }

        private bool IsSafe(char[][] board, int row, int col)
        {
            int n = board.Length;
            
            // Check column
            for (int i = 0; i < row; i++)
            {
                if (board[i][col] == 'Q') return false;
            }
            
            // Check diagonal (top-left to bottom-right)
            for (int i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--)
            {
                if (board[i][j] == 'Q') return false;
            }
            
            // Check diagonal (top-right to bottom-left)
            for (int i = row - 1, j = col + 1; i >= 0 && j < n; i--, j++)
            {
                if (board[i][j] == 'Q') return false;
            }
            
            return true;
        }

        private void PrintChessboard(IList<string> board)
        {
            foreach (string row in board)
            {
                Console.WriteLine($"  {row}");
            }
        }
        #endregion

        #region Problem 5: Sudoku Solver
        /// <summary>
        /// Solve 9x9 Sudoku puzzle using backtracking
        /// Pseudocode:
        /// 1. Find next empty cell (marked with '.')
        /// 2. Try digits 1-9 in that cell
        /// 3. Check if digit is valid (row, column, 3x3 box)
        /// 4. If valid: place digit and recurse
        /// 5. If puzzle solved: return true
        /// 6. If no solution: backtrack and try next digit
        /// </summary>
        public void DemonstrateSudokuSolver()
        {
            Console.WriteLine("\n🔍 Problem 5: Sudoku Solver");

            char[,] board = {
                {'5','3','.','.','7','.','.','.','.'},
                {'6','.','.','1','9','5','.','.','.'},
                {'.','9','8','.','.','.','.','6','.'},
                {'8','.','.','.','6','.','.','.','3'},
                {'4','.','.','8','.','3','.','.','1'},
                {'7','.','.','.','2','.','.','.','6'},
                {'.','6','.','.','.','.','2','8','.'},
                {'.','.','.','4','1','9','.','.','5'},
                {'.','.','.','.','8','.','.','7','9'}
            };

            Console.WriteLine("Original Sudoku:");
            PrintSudoku(board);

            bool solved = SolveSudoku(board);
            if (solved)
            {
                Console.WriteLine("\n✅ Solved Sudoku:");
                PrintSudoku(board);
            }
            else
            {
                Console.WriteLine("❌ No solution exists");
            }
        }

        public bool SolveSudoku(char[,] board)
        {
            for (int row = 0; row < 9; row++)
            {
                for (int col = 0; col < 9; col++)
                {
                    if (board[row, col] == '.')
                    {
                        // Try digits 1-9
                        for (char digit = '1'; digit <= '9'; digit++)
                        {
                            if (IsValidSudoku(board, row, col, digit))
                            {
                                // Choose
                                board[row, col] = digit;

                                // Explore
                                if (SolveSudoku(board))
                                {
                                    return true; // Solution found
                                }

                                // Unchoose (backtrack)
                                board[row, col] = '.';
                            }
                        }
                        return false; // No valid digit found
                    }
                }
            }
            return true; // All cells filled
        }

        private bool IsValidSudoku(char[,] board, int row, int col, char digit)
        {
            // Check row
            for (int j = 0; j < 9; j++)
            {
                if (board[row, j] == digit) return false;
            }

            // Check column
            for (int i = 0; i < 9; i++)
            {
                if (board[i, col] == digit) return false;
            }

            // Check 3x3 box
            int boxRow = (row / 3) * 3;
            int boxCol = (col / 3) * 3;
            for (int i = boxRow; i < boxRow + 3; i++)
            {
                for (int j = boxCol; j < boxCol + 3; j++)
                {
                    if (board[i, j] == digit) return false;
                }
            }

            return true;
        }

        private void PrintSudoku(char[,] board)
        {
            for (int i = 0; i < 9; i++)
            {
                if (i % 3 == 0 && i != 0)
                {
                    Console.WriteLine("  ------+-------+------");
                }

                Console.Write("  ");
                for (int j = 0; j < 9; j++)
                {
                    if (j % 3 == 0 && j != 0)
                    {
                        Console.Write("| ");
                    }
                    Console.Write(board[i, j] + " ");
                }
                Console.WriteLine();
            }
        }
        #endregion

        #region Problem 6: Word Search
        /// <summary>
        /// Find if word exists in 2D character grid
        /// Pseudocode:
        /// 1. For each cell in grid: try starting word search from that cell
        /// 2. DFS with backtracking:
        ///    - If current character matches: mark as visited and recurse
        ///    - If word completely found: return true
        ///    - If path doesn't work: unmark cell (backtrack)
        /// 3. Return true if any starting position leads to solution
        /// </summary>
        public void DemonstrateWordSearch()
        {
            Console.WriteLine("\n🔍 Problem 6: Word Search in 2D Grid");

            char[,] board = {
                {'A','B','C','E'},
                {'S','F','C','S'},
                {'A','D','E','E'}
            };

            string word = "ABCCED";

            Console.WriteLine("Grid:");
            PrintCharGrid(board);
            Console.WriteLine($"Search word: '{word}'");

            bool exists = WordSearch(board, word);
            Console.WriteLine($"✅ Word exists: {exists}");
        }

        public bool WordSearch(char[,] board, string word)
        {
            int rows = board.GetLength(0);
            int cols = board.GetLength(1);

            // Try starting from each cell
            for (int i = 0; i < rows; i++)
            {
                for (int j = 0; j < cols; j++)
                {
                    if (BacktrackWordSearch(board, word, i, j, 0))
                    {
                        return true;
                    }
                }
            }

            return false;
        }

        private bool BacktrackWordSearch(char[,] board, string word, int row, int col, int index)
        {
            // Base case: word found
            if (index == word.Length) return true;

            // Boundary checks
            if (row < 0 || row >= board.GetLength(0) ||
                col < 0 || col >= board.GetLength(1) ||
                board[row, col] != word[index])
            {
                return false;
            }

            // Choose: mark cell as visited
            char temp = board[row, col];
            board[row, col] = '#'; // Mark as visited

            // Explore: search in all 4 directions
            bool found = BacktrackWordSearch(board, word, row + 1, col, index + 1) ||
                        BacktrackWordSearch(board, word, row - 1, col, index + 1) ||
                        BacktrackWordSearch(board, word, row, col + 1, index + 1) ||
                        BacktrackWordSearch(board, word, row, col - 1, index + 1);

            // Unchoose: restore cell (backtrack)
            board[row, col] = temp;

            return found;
        }

        private void PrintCharGrid(char[,] grid)
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
    }
}
