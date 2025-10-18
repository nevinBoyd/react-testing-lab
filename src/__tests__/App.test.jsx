import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { describe, it, expect, beforeEach, vi } from "vitest"
import App from "../components/App"

beforeEach(() => {
    setFetchResponse([
        { id: 1, description: "Coffee", category: "Food", amount: 5 },
        { id: 2, description: "Electric Bill", category: "Utilities", amount: 100 },
    ])
})

describe("Banking App Core Features", () => {
    // TEST 1: display on load
    it("displays transactions on load", async () => {
        render(<App />)
        await waitFor(() => {
            expect(screen.getByText("Coffee")).toBeInTheDocument()
            expect(screen.getByText("Electric Bill")).toBeInTheDocument()
        })
    })

    // TEST 2: search filtering
    it("filters transactions by search term", async () => {
        render(<App />)
        const searchInput = screen.getByPlaceholderText(/search your recent transactions/i)
        fireEvent.change(searchInput, { target: { value: "Coffee" } })
        await waitFor(() => {
            expect(screen.getByText("Coffee")).toBeInTheDocument()
            expect(screen.queryByText("Electric Bill")).not.toBeInTheDocument()
        })
    })

    // TEST 3: add transaction
    it("adds a new transaction when the form is submitted", async () => {
        render(<App />)

        // Mock fetch for both GET and POST
        global.fetch = vi.fn((url, options) => {
            if (options && options.method === "POST") {
                return Promise.resolve({
                    ok: true,
                    json: () =>
                        Promise.resolve({
                            id: 3,
                            date: "2024-01-03",
                            description: "Groceries",
                            category: "Food",
                            amount: 50,
                        }),
                })
            }
            return Promise.resolve({
                ok: true,
                json: () =>
                    Promise.resolve([
                        { id: 1, description: "Coffee", category: "Food", amount: 5 },
                        { id: 2, description: "Electric Bill", category: "Utilities", amount: 100 },
                    ]),
            })
        })

        // use querySelector to grab date input properly
        const dateInput = document.querySelector('input[type="date"]')
        fireEvent.change(dateInput, { target: { value: "2024-01-03" } })

        fireEvent.change(screen.getByPlaceholderText(/description/i), { target: { value: "Groceries" } })
        fireEvent.change(screen.getByPlaceholderText(/category/i), { target: { value: "Food" } })
        fireEvent.change(screen.getByPlaceholderText(/amount/i), { target: { value: "50" } })

        const submitBtn = screen.getByRole("button", { name: /add transaction/i })
        fireEvent.click(submitBtn)

        await waitFor(() => expect(global.fetch).toHaveBeenCalled())
        await waitFor(() => expect(screen.getByText("Groceries")).toBeInTheDocument())
    })
})
