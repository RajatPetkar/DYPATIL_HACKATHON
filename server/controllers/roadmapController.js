const mongoose = require("mongoose");
const roadmapModel = require("../models/roadmapModel");
const userModel = require("../models/userModel");
const generateRoadmap = require("../utils/roadmapGeneration");
const checkpointModel = require("../models/checkpointSchema");

const roadmapController = {
    getAllRoadmaps: async (req, res) => {
        try {
            const userId = req.userId;
            const roadmaps = await userModel.getUsersRoadmaps(userId);
            res.json(roadmaps);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    createRoadmap: async (req, res) => {
        try {
            const topic = req.body.topic;
            const user = await userModel.findById(req.userId);
    
            console.log("Fetching Cluster Summary for:", user.toObject().clusterId);
    
            const _res = await fetch(`http://127.0.0.1:8000/cluster/summary?id=${user.toObject().clusterId}`);

            if (!_res.ok) {
                throw new Error("Cluster API request failed");
            }
            const data = await _res.json();
            
            if (!data.summary) {
                return res.status(400).json({ message: "Cluster summaries not found" });
            }
    
            console.log("Cluster Summary Data:", data.summary);
    
            const roadmap = await generateRoadmap(topic, data.summary);
            if (!roadmap || !roadmap.checkpoints) {
                throw new Error("Failed to generate roadmap");
            }
    
            console.log("Generated Roadmap:", roadmap);
    
            const checkpoints = roadmap.checkpoints ? await Promise.all(
                roadmap.checkpoints.map(async (checkpoint, index) => {
                    checkpoint.order = index + 1;
                    const newCheckpoint = await checkpointModel.createCheckpoint(checkpoint);
                    return newCheckpoint._id;
                })
            ) : [];
    
            const newRoadmap = new roadmapModel({
                userId: new mongoose.Types.ObjectId(req.userId),
                mainTopic: roadmap.mainTopic,
                description: roadmap.description,
                checkpoints: checkpoints
            });
    
            const savedRoadmap = await newRoadmap.save();
            await userModel.addRoadmap(req.userId, savedRoadmap._id);
    
            savedRoadmap.checkpoints = await checkpointModel.getCheckpoints(savedRoadmap.checkpoints);
            res.status(201).json(savedRoadmap);
        } catch (error) {
            console.error("Error generating roadmap:", error);
            res.status(500).json({ message: error.message });
        }
    },
    
    updateCheckpointStatus: async (req, res) => {
        try {
            const {roadmapId, checkpointId, status} = req.body;
            const roadmap = await roadmapModel.findById(roadmapId);
            const checkpoint = await checkpointModel.findById(checkpointId);

            if(!roadmap || !checkpoint){
                res.status(404).json({ message: "Roadmap or checkpoint not found" });
            }

            if(status === 'completed'){
                checkpoint.completedAt = new Date();const mongoose = require("mongoose");
                const roadmapModel = require("../models/roadmapModel");
                const userModel = require("../models/userModel");
                const generateRoadmap = require("../utils/roadmapGeneration");
                const checkpointModel = require("../models/checkpointSchema");
                
                const createCheckpoints = async (checkpoints) => {
                  return Promise.all(
                    checkpoints.map(async (checkpoint, index) => {
                      checkpoint.order = index + 1;
                      const newCheckpoint = await checkpointModel.createCheckpoint(checkpoint);
                      return newCheckpoint._id;
                    })
                  );
                };
                
                const roadmapController = {
                  // Fetch all roadmaps for a user
                  getAllRoadmaps: async (req, res) => {
                    try {
                      const userId = req?.userId;
                      if (!userId) return res.status(401).json({ message: "Unauthorized" });
                
                      const roadmaps = await userModel.getUsersRoadmaps(userId);
                      res.json(roadmaps);
                    } catch (error) {
                      console.error("Error fetching roadmaps:", error.message);
                      res.status(500).json({ message: error.message });
                    }
                  },
                
                  // Create roadmap for a topic using cluster summary
                  createRoadmap: async (req, res) => {
                    try {
                      const topic = req.body.topic;
                      const user = await userModel.findById(req.userId);
                
                      if (!user) {
                        return res.status(404).json({ message: "User not found" });
                      }
                
                      const clusterSummaryUrl = `http://127.0.0.1:8000/cluster/summary?id=${user.clusterId}`;
                      const _res = await fetch(clusterSummaryUrl);
                
                      if (!_res.ok) {
                        throw new Error("Cluster API request failed");
                      }
                
                      const data = await _res.json();
                
                      if (!data.summary) {
                        return res.status(404).json({ message: "Cluster summary not found" });
                      }
                
                      const roadmap = await generateRoadmap(topic, data.summary);
                
                      if (!roadmap || !roadmap.checkpoints) {
                        throw new Error("Failed to generate roadmap");
                      }
                
                      const checkpoints = roadmap.checkpoints
                        ? await createCheckpoints(roadmap.checkpoints)
                        : [];
                
                      const newRoadmap = new roadmapModel({
                        userId: new mongoose.Types.ObjectId(req.userId),
                        mainTopic: roadmap.mainTopic,
                        description: roadmap.description,
                        checkpoints: checkpoints,
                      });
                
                      const savedRoadmap = await newRoadmap.save();
                
                      await userModel.addRoadmap(req.userId, savedRoadmap._id);
                
                      savedRoadmap.checkpoints = await checkpointModel.getCheckpoints(savedRoadmap.checkpoints);
                
                      res.status(201).json(savedRoadmap);
                    } catch (error) {
                      console.error("Error generating roadmap:", error.message);
                      res.status(500).json({ message: error.message });
                    }
                  },
                
                  // Update status of a checkpoint
                  updateCheckpointStatus: async (req, res) => {
                    try {
                      const { roadmapId, checkpointId, status } = req.body;
                
                      const roadmap = await roadmapModel.findById(roadmapId);
                      const checkpoint = await checkpointModel.findById(checkpointId);
                
                      if (!roadmap || !checkpoint) {
                        return res.status(404).json({ message: "Roadmap or checkpoint not found" });
                      }
                
                      if (status === "completed") {
                        checkpoint.completedAt = new Date();
                      }
                
                      checkpoint.status = status;
                      await checkpoint.save();
                
                      roadmap.checkpoints = await checkpointModel.getCheckpoints(roadmap.checkpoints);
                
                      const completedCheckpoints = roadmap.checkpoints.filter(cp => cp.status === "completed");
                      roadmap.totalProgress = (completedCheckpoints.length / roadmap.checkpoints.length) * 100;
                
                      await roadmap.save();
                      roadmap.checkpoints = await checkpointModel.getCheckpoints(roadmap.checkpoints);
                
                      res.json(roadmap);
                    } catch (error) {
                      console.error("Error updating checkpoint status:", error.message);
                      res.status(500).json({ message: error.message });
                    }
                  },
                };
                
                module.exports = roadmapController;
                
            }
            checkpoint.status = status;
            await checkpoint.save();

            roadmap.checkpoints = await checkpointModel.getCheckpoints(roadmap.checkpoints);

            const completedCheckpoints = roadmap.checkpoints.filter(checkpoint => checkpoint.status == 'completed');
            roadmap.totalProgress = completedCheckpoints.length / roadmap.checkpoints.length * 100;
            
            await roadmap.save();
            roadmap.checkpoints = await checkpointModel.getCheckpoints(roadmap.checkpoints);
            res.json(roadmap);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
};

module.exports = roadmapController;