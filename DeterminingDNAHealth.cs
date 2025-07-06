using System;
using System.Collections.Generic;
using System.Linq;

public class DeterminingDNAHealth
{
    class TrieNode
    {
        public Dictionary<char, TrieNode> Children { get; } = new Dictionary<char, TrieNode>();
        public TrieNode FailureLink { get; set; }
        public TrieNode OutputLink { get; set; }
        public List<int> GeneIndices { get; } = new List<int>();
    }

    class AhoCorasick
    {
        private readonly TrieNode _root = new TrieNode();
        private readonly string[] _genes;
        private readonly int[] _healths;
        private readonly int _maxGeneIndex;

        public AhoCorasick(string[] genes, int[] healths)
        {
            _genes = genes;
            _healths = healths;
            _maxGeneIndex = genes.Length - 1;
            BuildTrie();
            BuildFailureLinks();
        }

        private void BuildTrie()
        {
            for (int i = 0; i < _genes.Length; i++)
            {
                TrieNode currentNode = _root;
                foreach (char c in _genes[i])
                {
                    if (!currentNode.Children.ContainsKey(c))
                    {
                        currentNode.Children[c] = new TrieNode();
                    }
                    currentNode = currentNode.Children[c];
                }
                currentNode.GeneIndices.Add(i);
            }
        }

        private void BuildFailureLinks()
        {
            Queue<TrieNode> queue = new Queue<TrieNode>();

            foreach (TrieNode node in _root.Children.Values)
            {
                node.FailureLink = _root;
                queue.Enqueue(node);
            }

            while (queue.Count > 0)
            {
                TrieNode currentNode = queue.Dequeue();

                foreach (var entry in currentNode.Children)
                {
                    char c = entry.Key;
                    TrieNode childNode = entry.Value;
                    TrieNode tempNode = currentNode.FailureLink;

                    while (tempNode != null && !tempNode.Children.ContainsKey(c))
                    {
                        tempNode = tempNode.FailureLink;
                    }

                    childNode.FailureLink = tempNode?.Children.ContainsKey(c) == true ? tempNode.Children[c] : _root;
                    queue.Enqueue(childNode);
                }
                
                // Build Output/Dictionary Link
                TrieNode failure = currentNode.FailureLink;
                if (failure.GeneIndices.Any()) {
                    currentNode.OutputLink = failure;
                } else {
                    currentNode.OutputLink = failure.OutputLink;
                }
            }
        }

        public long CalculateHealth(int start, int end, string dna)
        {
            long totalHealth = 0;
            TrieNode currentNode = _root;

            foreach (char c in dna)
            {
                while (currentNode != null && !currentNode.Children.ContainsKey(c))
                {
                    currentNode = currentNode.FailureLink;
                }

                currentNode = currentNode ?? _root;

                if (currentNode.Children.ContainsKey(c))
                {
                    currentNode = currentNode.Children[c];

                    TrieNode tempNode = currentNode;
                    while (tempNode != null)
                    {
                        foreach (int geneIndex in tempNode.GeneIndices)
                        {
                            if (geneIndex >= start && geneIndex <= end)
                            {
                                totalHealth += _healths[geneIndex];
                            }
                        }
                        tempNode = tempNode.OutputLink;
                    }
                }
            }
            return totalHealth;
        }
    }

    public static void Main(string[] args)
    {
        int n = Convert.ToInt32(Console.ReadLine());
        string[] genes = Console.ReadLine().Split(' ');
        int[] health = Array.ConvertAll(Console.ReadLine().Split(' '), int.Parse);

        var ahoCorasick = new AhoCorasick(genes, health);

        int s = Convert.ToInt32(Console.ReadLine());
        long minHealth = long.MaxValue;
        long maxHealth = long.MinValue;

        for (int i = 0; i < s; i++)
        {
            string[] inputs = Console.ReadLine().Split(' ');
            int start = Convert.ToInt32(inputs[0]);
            int end = Convert.ToInt32(inputs[1]);
            string d = inputs[2];

            long currentHealth = ahoCorasick.CalculateHealth(start, end, d);

            if (currentHealth < minHealth)
            {
                minHealth = currentHealth;
            }
            if (currentHealth > maxHealth)
            {
                maxHealth = currentHealth;
            }
        }

        Console.WriteLine($"{minHealth} {maxHealth}");
    }
}