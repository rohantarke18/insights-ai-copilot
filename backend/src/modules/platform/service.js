const db =  require("../../db/schema");
exports.getDashboard = (userId) => {
   
    return new Promise((resolve, reject) => {

        db.all(
            "SELECT id, idea_text, created_at, status FROM sessions WHERE user_id = ?",
            [userId],
            (err, sessions) => {

                if (err) return reject(err);

                db.get(
                    `SELECT
                        COUNT(*) AS ideasExplored,
                        (SELECT COUNT(*) FROM sources) AS sourcesAnalyzed,
                        (SELECT COUNT(*) FROM project_plans) AS plansGenerated`,
                    [],
                    (err, stats) => {

                        if (err) return reject(err);

                        resolve({
                            stats,
                            sessions: sessions.map(s => ({
                                sessionId: s.id.toString(),
                                ideaText: s.idea_text,
                                createdAt: s.created_at,
                                status: s.status
                            }))
                        });

                    }
                );

            }
        );

    });
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