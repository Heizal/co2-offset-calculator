describe("Login Flow", () => {
    beforeEach(() => {
      cy.visit("http://localhost:5173/login"); // ✅ Use full URL
    });
  
    it("should allow users to log in with Google", () => {
      cy.contains("Sign in with Google").click();
      cy.url().should("include", "/"); // ✅ Ensure user is redirected to Home
    });
  });
  
  