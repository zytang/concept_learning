import { render, screen } from '@testing-library/react'
import { ConceptMap } from '../ConceptMap'
import { vi, test, expect, beforeAll } from 'vitest'

// Mock ResizeObserver
beforeAll(() => {
    global.ResizeObserver = vi.fn().mockImplementation(() => ({
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
    }))
})

// Mock ReactFlow
vi.mock('reactflow', async () => {
    const actual = await vi.importActual('reactflow');
    return {
        ...actual,
        default: ({ nodes, children }: any) => (
            <div data-testid="react-flow">
                {nodes.map((n: any) => (
                    <div key={n.id}>{n.data.label}</div>
                ))}
                {children}
            </div>
        ),
        Background: () => <div>Background</div>,
        Controls: () => <div>Controls</div>,
    }
})

test('renders concepts as nodes', () => {
    const concepts = [
        { id: '1', term: 'Database', explanation: 'A structured set of data.' },
        { id: '2', term: 'SQL', explanation: 'Language to query DB.' }
    ]
    const deepDives: any[] = []

    render(<ConceptMap concepts={concepts} deepDives={deepDives} />)

    expect(screen.getByText('Database')).toBeInTheDocument()
    expect(screen.getByText('SQL')).toBeInTheDocument()
})
