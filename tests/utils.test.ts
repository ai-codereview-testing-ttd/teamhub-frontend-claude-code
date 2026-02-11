import {
  formatDate,
  truncate,
  slugify,
  capitalize,
  isOverdue,
  isValidEmail,
  isDateAfter,
  filterByDateRange,
  formatNumber,
  deepClone,
} from "@/lib/utils";

describe("utils", () => {
  describe("formatDate", () => {
    it("formats a date string to human-readable format", () => {
      const result = formatDate("2024-03-15T10:00:00Z");
      expect(result).toContain("Mar");
      expect(result).toContain("15");
      expect(result).toContain("2024");
    });
  });

  describe("truncate", () => {
    it("returns the string as-is if shorter than max length", () => {
      expect(truncate("hello", 10)).toBe("hello");
    });

    it("truncates and adds ellipsis if longer than max length", () => {
      expect(truncate("hello world", 8)).toBe("hello...");
    });
  });

  describe("slugify", () => {
    it("converts a string to a URL-friendly slug", () => {
      expect(slugify("Hello World")).toBe("hello-world");
      expect(slugify("  My Project! ")).toBe("my-project");
      expect(slugify("camelCase Test")).toBe("camelcase-test");
    });
  });

  describe("capitalize", () => {
    it("capitalizes the first letter", () => {
      expect(capitalize("hello")).toBe("Hello");
      expect(capitalize("WORLD")).toBe("World");
    });
  });

  describe("isOverdue", () => {
    it("returns false for null dates", () => {
      expect(isOverdue(null)).toBe(false);
    });

    it("returns true for past dates", () => {
      expect(isOverdue("2020-01-01")).toBe(true);
    });

    it("returns false for future dates", () => {
      expect(isOverdue("2099-12-31")).toBe(false);
    });
  });

  describe("isValidEmail", () => {
    it("validates correct emails", () => {
      expect(isValidEmail("test@example.com")).toBe(true);
      expect(isValidEmail("user+tag@domain.co")).toBe(true);
    });

    it("rejects invalid emails", () => {
      expect(isValidEmail("not-an-email")).toBe(false);
      expect(isValidEmail("@domain.com")).toBe(false);
      expect(isValidEmail("user@")).toBe(false);
    });
  });

  describe("isDateAfter", () => {
    it("returns true when dateA is after dateB", () => {
      expect(isDateAfter("2024-03-15", "2024-03-14")).toBe(true);
    });

    it("returns false when dateA is before dateB", () => {
      expect(isDateAfter("2024-03-14", "2024-03-15")).toBe(false);
    });

    it("returns false for equal dates", () => {
      expect(isDateAfter("2024-03-15", "2024-03-15")).toBe(false);
    });
  });

  describe("filterByDateRange", () => {
    const items = [
      { id: "1", date: "2024-01-15" },
      { id: "2", date: "2024-02-15" },
      { id: "3", date: "2024-03-15" },
      { id: "4", date: null },
    ];

    it("filters items within date range", () => {
      const result = filterByDateRange(
        items,
        (item) => item.date,
        "2024-01-01",
        "2024-02-28"
      );
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe("1");
      expect(result[1].id).toBe("2");
    });

    it("excludes items with null dates", () => {
      const result = filterByDateRange(
        items,
        (item) => item.date,
        null,
        null
      );
      expect(result).toHaveLength(3);
    });
  });

  describe("formatNumber", () => {
    it("formats numbers with commas", () => {
      expect(formatNumber(1234567)).toBe("1,234,567");
      expect(formatNumber(42)).toBe("42");
    });
  });

  describe("deepClone", () => {
    it("creates a deep copy of an object", () => {
      const original = { a: 1, b: { c: 2 } };
      const cloned = deepClone(original);
      cloned.b.c = 99;
      expect(original.b.c).toBe(2);
    });
  });
});
