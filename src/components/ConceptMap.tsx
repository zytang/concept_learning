"use client";

import { useState, useCallback, useMemo } from "react";
import ReactFlow, { Background, Controls, Node, Edge, MarkerType, NodeMouseHandler } from "reactflow";
import "reactflow/dist/style.css";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Flashcard } from "@/components/Flashcard";

interface ConceptMapProps {
    concepts: { id: string; term: string; explanation: string; definition: string }[];
    deepDives: { conceptId: string; relatedConcepts: string[] }[];
}

export function ConceptMap({ concepts, deepDives }: ConceptMapProps) {
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const [flashcardNode, setFlashcardNode] = useState<{ term: string; definition: string; explanation: string } | null>(null);

    // 1. Calculate Edges & Adjacency List
    const { edges, adjacency } = useMemo(() => {
        const _edges: Edge[] = [];
        const _adjacency: Record<string, string[]> = {};
        const addedEdges = new Set<string>();

        // Initialize adjacency
        concepts.forEach(c => _adjacency[c.id] = []);

        deepDives.forEach(dd => {
            const sourceId = dd.conceptId;
            const sourceConcept = concepts.find(c => c.id === sourceId);
            if (!sourceConcept) return;

            dd.relatedConcepts.forEach(relatedTerm => {
                const targetConcept = concepts.find(c =>
                    c.term.toLowerCase().includes(relatedTerm.toLowerCase()) ||
                    relatedTerm.toLowerCase().includes(c.term.toLowerCase())
                );

                if (targetConcept && targetConcept.id !== sourceId) {
                    const edgeId = `e-${sourceId}-${targetConcept.id}`;
                    if (!addedEdges.has(edgeId)) {
                        addedEdges.add(edgeId);

                        _edges.push({
                            id: edgeId,
                            source: sourceId,
                            target: targetConcept.id,
                            animated: true,
                            markerEnd: { type: MarkerType.ArrowClosed },
                        });

                        // Populate adjacency (undirected for highlighting purposes)
                        _adjacency[sourceId].push(targetConcept.id);
                        if (!_adjacency[targetConcept.id]) _adjacency[targetConcept.id] = [];
                        _adjacency[targetConcept.id].push(sourceId);
                    }
                }
            });
        });
        return { edges: _edges, adjacency: _adjacency };
    }, [concepts, deepDives]);

    // 2. Determine Nodes with Highlight Styles
    const nodes: Node[] = isNaN(concepts.length) ? [] : concepts.map((c, i) => {
        const angle = (i / concepts.length) * 2 * Math.PI;
        const radius = 250;
        const x = Math.cos(angle) * radius + 400;
        const y = Math.sin(angle) * radius + 300;

        // Visual Logic
        const isSelected = selectedNodeId === c.id;
        const isNeighbor = selectedNodeId ? adjacency[selectedNodeId]?.includes(c.id) : false;
        const isDimmed = selectedNodeId && !isSelected && !isNeighbor;

        return {
            id: c.id,
            position: { x, y },
            data: { label: c.term, definition: c.definition, explanation: c.explanation }, // Pass data for flashcard
            style: {
                background: isSelected ? '#e0f2fe' : '#fff', // Light blue if selected
                border: isSelected ? '2px solid #0284c7' : '1px solid #777',
                borderRadius: '8px',
                padding: '10px',
                width: 150,
                fontWeight: 'bold',
                textAlign: 'center',
                opacity: isDimmed ? 0.1 : 1, // Dim if not relevant
                transition: 'opacity 0.2s, border 0.2s',
                cursor: 'pointer',
            },
        };
    });

    // 3. Dim Edges Logic
    const finalEdges = edges.map((edge: Edge) => {
        const isConnectedToSelected = selectedNodeId ? (edge.source === selectedNodeId || edge.target === selectedNodeId) : true;
        return {
            ...edge,
            style: {
                opacity: selectedNodeId && !isConnectedToSelected ? 0.1 : 1,
                stroke: selectedNodeId && isConnectedToSelected ? '#0284c7' : '#b1b1b7',
            }
        };
    });

    const onNodeClick: NodeMouseHandler = useCallback((event, node) => {
        setSelectedNodeId(node.id);
    }, []);

    const onPaneClick = useCallback(() => {
        setSelectedNodeId(null);
    }, []);

    const onNodeDoubleClick: NodeMouseHandler = useCallback((event, node) => {
        // Open Flashcard
        setFlashcardNode({
            term: node.data.label,
            definition: node.data.definition,
            explanation: node.data.explanation
        });
    }, []);

    return (
        <div className="h-[500px] w-full border rounded-lg shadow-sm bg-white relative">
            <ReactFlow
                nodes={nodes}
                edges={finalEdges}
                fitView
                onNodeClick={onNodeClick}
                onPaneClick={onPaneClick}
                onNodeDoubleClick={onNodeDoubleClick}
            >
                <Background />
                <Controls />
            </ReactFlow>

            {/* Flashcard Dialog */}
            <Dialog open={!!flashcardNode} onOpenChange={(open) => !open && setFlashcardNode(null)}>
                <DialogContent className="sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle>Quick Review: {flashcardNode?.term}</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        {flashcardNode && (
                            <Flashcard
                                term={flashcardNode.term}
                                definition={flashcardNode.definition}
                                explanation={flashcardNode.explanation}
                            />
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
