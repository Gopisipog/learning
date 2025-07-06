using System;
using System.Collections.Generic;

class MinimumTimeAtSchool
{
    public static int Calculate(List<string> schedule, int k)
    {
        int n = schedule.Count; // Number of days
        int totalTime = 0;

        // Process each day separately
        for (int day = 0; day < n; day++)
        {
            totalTime += MinimumTimeForDay(schedule[day], k);
        }

        return totalTime;
    }

    private static int MinimumTimeForDay(string daySchedule, int k)
{
    int m = daySchedule.Length; // Hours in a day
    List<int> lectureHours = new List<int>();
    
    // Collect all lecture hours for this day
    for (int hour = 0; hour < m; hour++)
    {
        if (daySchedule[hour] == '1')
            lectureHours.Add(hour);
    }
    
    int lectureCount = lectureHours.Count;
    
    // If we can skip all lectures, return 0
    if (lectureCount <= k)
        return 0;
    
    // If we can't skip all lectures, we need to attend at least some
    // Try all possible ways to skip k lectures to minimize time
    int minTime = m;
    
    // Try all possible combinations of skipping k lectures
    for (int i = 0; i <= k && i < lectureCount; i++)
    {
        // Try skipping i lectures from the beginning
        for (int j = 0; j <= k - i && j < lectureCount - i; j++)
        {
            // Skip i from beginning, j from end
            int firstLecture = i;
            int lastLecture = lectureCount - 1 - j;
            
            int timeSpent = lectureHours[lastLecture] - lectureHours[firstLecture] + 1;
            minTime = Math.Min(minTime, timeSpent);
        }
    }
    
    return minTime;
    }
}
