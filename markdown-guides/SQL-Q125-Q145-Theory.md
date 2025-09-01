# SQL Interview Theory (SQL Server Focus): Q125–Q145

This guide provides thorough, theory-first explanations for questions Q125–Q145 as referenced in 500q.txt. Examples use T-SQL (SQL Server).

---

## Q125. Difference between HAVING and WHERE
- Purpose:
  - WHERE filters rows before grouping/aggregation.
  - HAVING filters groups after GROUP BY/aggregation.
- Execution order (conceptual): FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY.
- Aggregates:
  - WHERE cannot use aggregates (SUM, COUNT, ...).
  - HAVING can reference aggregates and grouping columns.
- Performance:
  - Prefer pushing predicates into WHERE so fewer rows reach aggregation.
- Example:
```sql
-- Sum salary per dept but only for active employees, then keep depts < 30000 total
SELECT DeptId, SUM(Salary) AS Total
FROM Employee
WHERE IsActive = 1              -- row filter
GROUP BY DeptId
HAVING SUM(Salary) < 30000;     -- group filter
```

## Q126. Subquery / Nested / Inner query
- Definition: A query embedded inside another query (SELECT/INSERT/UPDATE/DELETE or inside WHERE/HAVING/SELECT list).
- Types:
  - Scalar subquery: returns one value.
  - Multi-row subquery: used with IN/ANY/ALL.
  - Correlated subquery: references columns from the outer query; executed per outer row.
- EXISTS vs IN:
  - EXISTS stops on first match; often better for correlated membership tests.
  - IN materializes/compares a list; can be slower with large sets.
- SARGability: Avoid wrapping indexed columns in functions inside subqueries.
- Example (correlated):
```sql
SELECT e.EmpId, e.Name
FROM Employee e
WHERE EXISTS (
  SELECT 1 FROM Sales s
  WHERE s.EmpId = e.EmpId AND s.Amount > 1000
);
```

## Q127. Auto Increment / Identity column
- IDENTITY(seed, increment) auto-generates numeric keys.
- Properties:
  - Assigned at insert; gaps can occur (rollbacks, reseed, deletes).
  - Use SCOPE_IDENTITY() to fetch last identity from current scope safely.
- Syntax:
```sql
CREATE TABLE Employee (
  Id INT IDENTITY(1,1) PRIMARY KEY,
  EmpName NVARCHAR(100) NOT NULL
);
-- Get new id after insert
INSERT INTO Employee(EmpName) VALUES ('Alice');
SELECT SCOPE_IDENTITY() AS NewId;
```
- Alternatives: SEQUENCE objects (more control, reusable across tables).

## Q128. What are Joins?
- Combine rows from two (or more) tables based on a related column/condition.
- Logical types: INNER, LEFT/RIGHT OUTER, FULL OUTER, CROSS (Cartesian), plus APPLY operators in T-SQL (CROSS/OUTER APPLY).

## Q129. Types of Joins (SQL Server)
- INNER JOIN: matching rows in both tables.
- LEFT OUTER JOIN: all left rows + matching right rows (else NULLs).
- RIGHT OUTER JOIN: all right rows + matching left.
- FULL OUTER JOIN: all rows from both, matching where possible.
- CROSS JOIN: Cartesian product (no condition).
- Examples:
```sql
SELECT * FROM A INNER JOIN B ON A.Key = B.Key;
SELECT * FROM A LEFT  JOIN B ON A.Key = B.Key;
SELECT * FROM A RIGHT JOIN B ON A.Key = B.Key;
SELECT * FROM A FULL  JOIN B ON A.Key = B.Key;
SELECT * FROM A CROSS JOIN B; -- caution: explosion
```

## Q130. Self-Join
- A table joined to itself; used for hierarchies (employee-manager), adjacency lists, successive comparisons.
```sql
SELECT e.EmpId, e.Name AS Employee, m.Name AS Manager
FROM Employee e
LEFT JOIN Employee m ON e.ManagerId = m.EmpId;
```
- For multi-level hierarchies, prefer recursive CTEs.

## Q131. Indexes in SQL Server
- Data structures (usually B-trees) that speed up data retrieval by maintaining sorted keys pointing to rows.
- Benefits: Faster reads, seek operations, efficient ORDER BY/GROUP BY.
- Costs: Extra storage, slower writes (insert/update/delete), maintenance.
- Key concepts: selectivity, covering index, included columns, fragmentation, fill factor, statistics.

## Q132. Clustered Index
- Defines the physical order of rows; the table is the clustered index (B-tree) keyed by the clustered key.
- One per table (because data can be ordered one way).
- Defaults: PRIMARY KEY creates clustered index unless specified otherwise.
- Good for range queries and monotonic keys (but beware of hotspots with ever-increasing keys).

## Q133. Non-Clustered Index
- Separate B-tree whose leaf nodes contain index keys and row locators (RID for heap or clustered key).
- Multiple per table allowed.
- Covering indexes add INCLUDE columns to satisfy queries without lookups.
```sql
CREATE NONCLUSTERED INDEX IX_Sales_Emp_Date
  ON Sales(EmpId, SaleDate)
  INCLUDE (Amount);
```

## Q134. Clustered vs Non-Clustered (differences)
- Location: clustered = table data ordered; non-clustered = separate structure.
- Count: 1 clustered; many non-clustered.
- Access: clustered good for range scans; non-clustered for selective point/range with possible key lookups.
- Storage/overhead: non-clustered store key + locator; updates must maintain all affected indexes.
- Design tip: narrow, stable clustered keys reduce non-clustered index bloat.

## Q135. Creating Clustered/Non-Clustered Indexes
- Explicit creation:
```sql
-- Clustered (if not already via PK)
CREATE CLUSTERED INDEX IX_Employee_Name
  ON dbo.Employee(Name);

-- Non-clustered with INCLUDE and filter
CREATE NONCLUSTERED INDEX IX_Order_CustId_Status
  ON dbo.[Order](CustomerId)
  INCLUDE (OrderDate, TotalAmount)
  WHERE Status = 'Completed'; -- filtered index

-- Unique index
CREATE UNIQUE INDEX UX_User_Handle ON dbo.[User](Handle);
```
- Constraints imply indexes: PRIMARY KEY → unique clustered (default); UNIQUE → unique non-clustered (default), but you can override.

## Q136. Which column to index for: `SELECT id, class FROM student WHERE name = 'happy'`
- Index the search predicate column: `name`.
- To avoid lookups, create a covering index with INCLUDE:
```sql
CREATE NONCLUSTERED INDEX IX_Student_Name
  ON dbo.Student(Name)
  INCLUDE (Id, Class);
```
- Ensure predicate is SARGable (avoid functions on Name), and consider collation/case sensitivity.

## Q137. Stored Procedure vs Function
- Stored Procedure (PROC):
  - Can perform DML (INSERT/UPDATE/DELETE), call procs, manage transactions, return multiple result sets and output params.
  - Invoked via EXEC; cannot be used directly in SELECT expressions.
- Function:
  - Scalar or Table-Valued (inline / multi-statement).
  - Should be deterministic/pure (no side-effects); limited T-SQL features; cannot change server state.
  - Can be used in SELECT/WHERE; inline TVF often optimizes like a view.
- Performance: scalar UDFs historically problematic (row-by-row); SQL Server 2019+ can inline some UDFs; inline TVF preferred.

## Q138. Optimizing Stored Procedures / SQL Queries
- Model the right indexes (seekable predicates, covering indexes).
- Write SARGable predicates; avoid wrapping columns in functions; avoid SELECT *.
- Parameter sniffing: consider OPTIMIZE FOR, RECOMPILE (sparingly), or use local vars for stability.
- Review execution plans (actual & estimated) for scans, spills, key lookups.
- Keep statistics updated; consider filtered indexes/stats for skewed data.
- Batch operations (set-based) instead of RBAR; avoid cursors unless necessary.
- Manage tempdb usage; appropriate data types; avoid implicit conversions.
- SET NOCOUNT ON to reduce TDS chatter for procs with many statements.

- Seekable predicates (SARGable): write predicates that let SQL Server use an index seek rather than a scan. Compare the column to a constant/parameter without wrapping the column in a function or performing non-sargable operations.
  - Avoid functions on the indexed column: `WHERE CONVERT(date, OrderDate) = @D` → rewrite as `WHERE OrderDate >= @D AND OrderDate < DATEADD(DAY,1,@D)`.
  - Avoid leading wildcards: `WHERE Name LIKE '%abc'` is non-seekable; prefer `LIKE 'abc%'` or add a computed, indexed column for reverse-search needs.
  - Avoid arithmetic on the column: `WHERE Amount + 10 > @X` → `WHERE Amount > @X - 10`.
  - Avoid OR across different columns when possible: split into `UNION ALL` of seekable predicates or use indexed `IN` on a single column.
  - Match data types to prevent implicit conversions that force scans (e.g., compare `INT` to `INT`, `NVARCHAR` to `NVARCHAR` with same collation).
  - Good: `WHERE OrderDate >= @From AND OrderDate < @To` (range seek)
  - Bad: `WHERE CONVERT(date, OrderDate) = @D` or `WHERE LEFT(Name,1) = 'A'` (forces scan)

- Covering indexes: design a nonclustered index whose key + INCLUDE columns satisfy a query so no extra lookups are needed.
  - Example:
    ```sql
    -- Query: SELECT OrderId, OrderDate, Total FROM dbo.[Order] WHERE CustomerId = @C
    CREATE NONCLUSTERED INDEX IX_Order_CustId
      ON dbo.[Order](CustomerId)
      INCLUDE (OrderId, OrderDate, Total);
    ```
  - Benefit: avoids key/RID lookups, lowering logical reads and latency.

## Q139. Cursor and why to avoid
- Cursors process rows one-by-one (RBAR), incurring CPU/memory/locking overhead.
- Prefer set-based operations which allow the optimizer to choose efficient plans.
- When to use: complex sequential logic, external calls per row, small datasets.
- If needed, use FAST_FORWARD/READ_ONLY; deallocate and close promptly.
  - FAST_FORWARD: shorthand for FORWARD_ONLY + READ_ONLY. Optimized for a single forward scan with minimal overhead (fastest lightweight cursor when you just need to iterate once and not update rows).
  - READ_ONLY: disallows updates through the cursor, enabling cheaper cursor implementations and query plan optimizations.
```sql
DECLARE Cur CURSOR FAST_FORWARD FOR SELECT Id FROM T;
OPEN Cur; FETCH NEXT FROM Cur INTO @Id; ...; CLOSE Cur; DEALLOCATE Cur;
```

## Q140. scope_identity vs @@identity
- @@IDENTITY: last identity value generated in the current session, across scopes (includes triggers) → can return identity from a trigger on a different table (dangerous).
- SCOPE_IDENTITY(): last identity in the current session and scope (excludes triggers) → safe for getting the row you just inserted.
- IDENT_CURRENT('TableName'): last identity for a table across all sessions (race-prone).
- Recommendation: use SCOPE_IDENTITY().

## Q141. CTE (Common Table Expression)
- A named, temporary result set defined with WITH; usable by a single following statement.
- Great for readability, composability, and recursion.
```sql
WITH DeptCTE AS (
  SELECT DeptId, SUM(Salary) AS Total
  FROM Employee
  GROUP BY DeptId
)
SELECT * FROM DeptCTE WHERE Total > 100000;

-- Recursive example (org chart)
WITH Org AS (
  SELECT EmpId, ManagerId, 0 AS Lvl FROM Employee WHERE ManagerId IS NULL
  UNION ALL
  SELECT e.EmpId, e.ManagerId, o.Lvl+1
  FROM Employee e JOIN Org o ON e.ManagerId = o.EmpId
)
SELECT * FROM Org OPTION (MAXRECURSION 100);
```

## Q142. DELETE vs TRUNCATE vs DROP
- DELETE (DML): removes rows; can have WHERE; fully logged; fires DELETE triggers; identity not reset (unless explicitly reseeded).
- TRUNCATE (DDL): deallocates data pages; removes all rows; minimally logged; faster; cannot have WHERE; resets identity; requires higher permissions; fails if referenced by FK.
- DROP (DDL): removes the object (table, index, view) definition and data.

## Q143. Nth highest salary
- Using window functions (handles ties):
```sql
SELECT * FROM (
  SELECT EmpId, Salary, DENSE_RANK() OVER (ORDER BY Salary DESC) AS r
  FROM Employee
) d
WHERE d.r = @N;
```
- Using OFFSET/FETCH (distinct salaries):
```sql
SELECT DISTINCT Salary
FROM Employee
ORDER BY Salary DESC
OFFSET (@N-1) ROWS FETCH NEXT 1 ROW ONLY;
```
- Avoid anti-patterns with nested TOP when ties must be considered.

## Q144. ACID properties
- Atomicity: transactions are all-or-nothing; partial changes are rolled back.
- Consistency: transactions move DB from one valid state to another (constraints preserved).
- Isolation: concurrent transactions don’t interfere; controlled by isolation levels (Read Uncommitted, Read Committed, Snapshot, Repeatable Read, Serializable).
- Durability: once committed, changes persist despite failures (WAL/transaction log).

## Q145. Magic Tables in SQL Server
- Special, memory-resident tables available inside DML triggers: inserted and deleted.
  - INSERT: inserted contains new rows, deleted is empty.
  - DELETE: deleted contains removed rows, inserted is empty.
  - UPDATE: deleted has old rows, inserted has new rows.
- Use cases: auditing, enforcing complex constraints, cascading logic.
- Limitations: only accessible within the trigger; represent the rows affected by the statement (set-based); avoid row-by-row processing in triggers for performance.
```sql
CREATE TRIGGER dbo.trg_Employee_Audit ON dbo.Employee
AFTER INSERT, UPDATE, DELETE AS
BEGIN
  INSERT dbo.EmployeeAudit (EmpId, ChangeType, ChangedAt)
  SELECT COALESCE(i.EmpId, d.EmpId),
         CASE WHEN i.EmpId IS NOT NULL AND d.EmpId IS NULL THEN 'INSERT'
              WHEN i.EmpId IS NOT NULL AND d.EmpId IS NOT NULL THEN 'UPDATE'
              ELSE 'DELETE' END,
         SYSUTCDATETIME()
  FROM inserted i
  FULL OUTER JOIN deleted d ON i.EmpId = d.EmpId;
END;
```

---

Notes
- Align index and key choices to workload (read/write mix, selectivity, access patterns).
- Favor set-based SQL and inspect execution plans to validate assumptions.


## Further Reading
- T-SQL fundamentals and set-based thinking:
  - Itzik Ben-Gan — T-SQL Fundamentals
  - Itzik Ben-Gan — T-SQL Querying
- Query tuning, execution plans, and SARGability:
  - Grant Fritchey — SQL Server Execution Plans
  - Benjamin Nevarez — SQL Server Query Tuning
  - Markus Winand — SQL Performance Explained
- Indexes and internals:
  - Kalen Delaney — SQL Server Internals
  - Dmitri Korotkevitch — Pro SQL Server Internals
- Stored procedures, parameter sniffing, and optimization:
  - Kathi Kellenberger & Scott Shaw — Beginning T-SQL
  - Louis Davidson & Tim Ford — Performance Tuning with SQL Server DMVs
- Transactions, isolation, and ACID:
  - Kalen Delaney — Inside SQL Server (Storage Engine/Internals)
  - Dmitri Korotkevitch — Pro SQL Server Internals
- Triggers and server-side programming:
  - Itzik Ben-Gan — T-SQL Fundamentals (inserted/deleted tables)
  - Joe Celko — SQL Programming Style; SQL for Smarties
- Official references (precise syntax/behavior):
  - Microsoft Docs — Transact-SQL Reference, Query Processing Architecture, Index Design Guidelines, Cursors, CTEs, IDENTITY

