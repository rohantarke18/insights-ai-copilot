exports.getDashboard = (userId) => {
    return {
        stats: {
            ideasExplored: 3,
            sourcesAnalyzed: 12,
            plansGenerated: 2
        },
        sessions: [
            {
                sessionId: "S001",
                ideaText: "AI Research Assistant",
                createdAt: new Date().toISOString(),
                status: "completed"
            }
        ]
    };
};

exports.getWorkspaces = (userId) => {
    return [
        {
            workspaceId: "W001",
            name: "My Workspace",
            itemCount: 5,
            updatedAt: new Date().toISOString()
        }
    ];
};

exports.createWorkspace = (body) => {
    return {
        workspaceId: "W002",
        name: body.name,
        itemCount: 0,
        updatedAt: new Date().toISOString()
    };
};

exports.saveWorkspaceItem = () => {
    return {
        success: true
    };
};

exports.deleteWorkspaceItem = () => {
    return {
        success: true
    };
};