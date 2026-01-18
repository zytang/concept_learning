import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { StudyInterface } from '../StudyInterface'
import { vi, test, expect } from 'vitest'

// Mock actions and components
vi.mock('@/actions/update-progress', () => ({
    updateMasteryAction: vi.fn(),
}))

vi.mock('@/components/Flashcard', () => ({
    Flashcard: () => <div>Flashcard Content</div>
}))

vi.mock('@/components/Quiz', () => ({
    Quiz: () => <div>Quiz Content</div>
}))

vi.mock('@/components/DeepDive', () => ({
    DeepDive: () => <div>DeepDive Content</div>
}))

const mockConcept = {
    id: 'c1',
    term: 'Test Concept',
    definition: 'Test Definition',
    explanation: 'Test Explanation',
    masteryLevel: 1,
    quizzes: [],
    deepDive: null,
    createdAt: new Date(),
    updatedAt: new Date(),
}

test('renders concept term and handles interactions', async () => {
    // Render
    render(<StudyInterface concept={mockConcept} />)

    // Check term
    expect(screen.getByText('Test Concept')).toBeInTheDocument()

    // Open Flashcard
    const reviewBtn = screen.getByText('Review')
    fireEvent.click(reviewBtn)

    await waitFor(() => {
        expect(screen.getByText('Flashcard Content')).toBeInTheDocument()
    })
})
