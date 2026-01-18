import { expect, test } from 'vitest'
import { cn } from '../utils'

test('cn merges classes correctly', () => {
    expect(cn('c1', 'c2')).toBe('c1 c2')
    expect(cn('c1', { c2: true, c3: false })).toBe('c1 c2')
    expect(cn('px-2 py-2', 'p-4')).toBe('p-4') // Tailwind merge
})
