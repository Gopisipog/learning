# C# Language Fundamentals: Learning Prompts

## 📝 Essential C# programming concepts for .NET Core

---

### 📚 Variables, Data Types, and Operators

1.  **Hello, World!**: Write a C# console application that prints "Hello, World!" to the console.
2.  **Variable Declaration**: Declare variables for your name, age, and favorite color. Print them out in a sentence.
3.  **Data Types**: Create variables of the following data types: `int`, `double`, `char`, `string`, and `bool`. Assign them values and print them.
4.  **Arithmetic Operators**: Write a program that takes two numbers as input and displays their sum, difference, product, and quotient.
5.  **User Input**: Create a program that asks the user for their name and age, then greets them by name and tells them their age next year.
6.  **Type Casting**: Declare a `double` and an `int`. Explicitly cast the `double` to an `int` and print the result. What happens to the decimal part?
7.  **String Concatenation vs. Interpolation**: Demonstrate the difference between string concatenation using the `+` operator and string interpolation.

---

### 📚 Control Structures and Loops

1.  **If-Else Statement**: Write a program that checks if a number is positive, negative, or zero.
2.  **Switch Statement**: Create a program that takes a number from 1 to 7 and prints the corresponding day of the week.
3.  **For Loop**: Write a `for` loop that prints the numbers from 1 to 10.
4.  **While Loop**: Write a `while` loop that prints the numbers from 10 down to 1.
5.  **Do-While Loop**: Create a simple number guessing game where the user has to guess a number between 1 and 100. Use a `do-while` loop to keep the game going until the user guesses correctly.
6.  **FizzBuzz**: Write a program that prints the numbers from 1 to 100. For multiples of three, print "Fizz" instead of the number. For multiples of five, print "Buzz". For numbers which are multiples of both three and five, print "FizzBuzz".
7.  **Nested Loops**: Use nested `for` loops to print a 5x5 multiplication table.

---

### 📚 Methods and Parameter Handling

1.  **Simple Method**: Write a method called `Greet` that takes a `string` parameter (a name) and prints a greeting to that person.
2.  **Return Values**: Create a method that takes two integers as parameters and returns their sum.
3.  **Method Overloading**: Create two methods with the same name, `Add`. One should take two `int` parameters, and the other should take two `double` parameters.
4.  **Optional Parameters**: Write a method that calculates the area of a rectangle. Make the height an optional parameter with a default value of 10.
5.  **Named Arguments**: Call the rectangle area method from the previous exercise using named arguments, passing the width first and then the height.
6.  **`ref` and `out` Parameters**:
    *   Write a method that uses a `ref` parameter to increment a number.
    *   Write a method that uses `out` parameters to return the area and perimeter of a circle.
7.  **Recursion**: Write a recursive method to calculate the factorial of a number.

---

### 📚 Object-Oriented Programming (OOP) Basics

1.  **Create a Class**: Create a `Person` class with properties for `FirstName`, `LastName`, and `Age`.
2.  **Instantiate an Object**: Create an instance of your `Person` class and set its properties.
3.  **Add a Method**: Add a method to the `Person` class called `GetFullName` that returns the person's full name.
4.  **Constructor**: Add a constructor to the `Person` class that takes the first name, last name, and age as parameters to initialize the properties.
5.  **Inheritance**: Create a `Student` class that inherits from the `Person` class. Add a `Major` property to the `Student` class.
6.  **Encapsulation**: Modify the `Person` class to use private fields and public properties for `Age`. Add validation in the property's setter to ensure the age is not negative.
7.  **Polymorphism**: Create a virtual method in the `Person` class called `Introduce`. Override this method in the `Student` class to include the student's major in the introduction. Create a list of `Person` objects, add both `Person` and `Student` objects to it, and loop through the list, calling the `Introduce` method on each object.