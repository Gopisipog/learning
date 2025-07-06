using System;
using System.Collections.Generic;

class DNAHealthTwoPointers
{
    /*
     * HackerRank Problem: Determining DNA Health
     * 
     * Problem Description:
     * We have a list of genes and their health values. We need to determine the 
     * health of DNA strands based on which genes are present in the strand.
     * 
     * For each DNA strand, we consider only a subset of genes (from index 'start' to 'end').
     * The health of a DNA strand is the sum of health values of all occurrences of 
     * valid genes in the strand.
     * 
     * We need to find the minimum and maximum possible health values across all queries.
     */
    
    // Simplified version using Two Pointers for substring matching
    // Note: For the full HackerRank problem, a more advanced algorithm like Aho-Corasick would be needed
    public static void DetermineDNAHealth(string[] genes, int[] health, List<(int start, int end, string dna)> queries)
    {
        long minHealth = long.MaxValue;
        long maxHealth = long.MinValue;
        
        foreach (var query in queries)
        {
            long strandHealth = 0;
            string dna = query.dna;
            
            // For each valid gene in the range [start, end]
            for (int i = query.start; i <= query.end; i++)
            {
                string gene = genes[i];
                int geneHealth = health[i];
                
                // Two Pointers approach to find all occurrences of gene in dna
                int occurrences = CountOccurrences(dna, gene);
                strandHealth += (long)occurrences * geneHealth;
            }
            
            minHealth = Math.Min(minHealth, strandHealth);
            maxHealth = Math.Max(maxHealth, strandHealth);
        }
        
        Console.WriteLine($"{minHealth} {maxHealth}");
    }
    
    // Two Pointers approach to count occurrences of a pattern in text
    private static int CountOccurrences(string text, string pattern)
    {
        if (string.IsNullOrEmpty(pattern)) return 0;
        
        int count = 0;
        int i = 0; // Pointer for the text
        
        // We subtract pattern.Length from text.Length to ensure there are enough remaining
        // characters to potentially match the pattern. For example, if text is 5 chars and
        // pattern is 3 chars, we only need to check positions 0, 1, and 2 as starting points
        while (i <= text.Length - pattern.Length)
        {
            bool match = true;
            
            // Second pointer for comparing characters
            for (int j = 0; j < pattern.Length; j++)
            {
                if (text[i + j] != pattern[j])
                {
                    match = false;
                    break;
                }
            }
            
            if (match)
            {
                count++;
                i++; // Move to next position to find overlapping matches
            }
            else
            {
                i++; // Move to next position
            }
        }
        
        return count;
    }
    
    // More efficient solution using Aho-Corasick algorithm
    // This is needed for the full HackerRank problem due to performance requirements
    public static void DetermineDNAHealthEfficient(string[] genes, int[] health, List<(int start, int end, string dna)> queries)
    {
        Console.WriteLine("\nUsing efficient Aho-Corasick algorithm:");
        
        var ahoCorasick = new AhoCorasick(genes, health);
        long minHealth = long.MaxValue;
        long maxHealth = long.MinValue;
        
        foreach (var query in queries)
        {
            long strandHealth = ahoCorasick.CalculateHealth(query.start, query.end, query.dna);
            
            minHealth = Math.Min(minHealth, strandHealth);
            maxHealth = Math.Max(maxHealth, strandHealth);
        }
        
        Console.WriteLine($"{minHealth} {maxHealth}");
    }
    
    public static void Main()
    {
        Console.WriteLine("HackerRank Problem: Determining DNA Health");
        Console.WriteLine("=========================================");
        
        // Sample input
        string[] genes = { "a", "b", "c", "aa", "d", "b" };
        int[] health = { 1, 2, 3, 4, 5, 6 };
        
        var queries = new List<(int, int, string)>
        {
            (1, 5, "caaab"),
            (0, 4, "xyz"),
            (2, 4, "bcdybc")
        };
        
        Console.WriteLine("Using Two Pointers approach for substring matching:");
        DetermineDNAHealth(genes, health, queries);
        
        // For larger inputs, use the more efficient algorithm
        DetermineDNAHealthEfficient(genes, health, queries);
    }
    
    // Simplified version of the Aho-Corasick algorithm
    class AhoCorasick
    {
        private class TrieNode
        {
            public Dictionary<char, TrieNode> Children { get; } = new Dictionary<char, TrieNode>();
            public List<int> GeneIndices { get; } = new List<int>();
            public TrieNode FailureLink { get; set; }
            public TrieNode OutputLink { get; set; }
        }
        
        private readonly TrieNode _root = new TrieNode();
        private readonly string[] _genes;
        private readonly int[] _healths;
        
        public AhoCorasick(string[] genes, int[] healths)
        {
            _genes = genes;
            _healths = healths;
            BuildTrie();
        }
        
        private void BuildTrie()
        {
            // Build the trie structure
            for (int i = 0; i < _genes.Length; i++)
            {
                TrieNode current = _root;
                foreach (char c in _genes[i])
                {
                    if (!current.Children.ContainsKey(c))
                    {
                        current.Children[c] = new TrieNode();
                    }
                    current = current.Children[c];
                }
                current.GeneIndices.Add(i);
            }
            
            // For a complete implementation, build failure and output links here
        }
        
        public long CalculateHealth(int start, int end, string dna)
        {
            long health = 0;
            
            // For each position in the DNA strand
            for (int i = 0; i < dna.Length; i++)
            {
                TrieNode current = _root;
                
                // Try to match genes starting at this position
                for (int j = i; j < dna.Length; j++)
                {
                    char c = dna[j];
                    
                    if (!current.Children.ContainsKey(c))
                        break;
                    
                    current = current.Children[c];
                    
                    // Check if we have a gene match at this node
                    foreach (int geneIndex in current.GeneIndices)
                    {
                        if (geneIndex >= start && geneIndex <= end)
                        {
                            health += _healths[geneIndex];
                        }
                    }
                }
            }
            
            return health;
        }
    }
}