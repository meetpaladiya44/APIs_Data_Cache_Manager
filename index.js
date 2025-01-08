const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Validate API Key middleware
const validateApiKey = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];
  if (apiKey !== process.env.CALCULATION_API_KEY) {
    return res.status(401).json({ error: "Unauthorized: Invalid API key" });
  }
  next();
};

// Calculation Endpoint
app.post("/calculate", validateApiKey, (req, res) => {
  const { bidAmount } = req.body;

  if (!bidAmount || typeof bidAmount !== "number") {
    return res.status(400).json({ error: "Invalid or missing bid amount" });
  }

  // Perform static calculations
  const riskFactor = bidAmount >= 1.0 ? 0.15 : bidAmount >= 0.5 ? 0.45 : 0.75;
  const utilizationFactor = Math.min(95, bidAmount * 100);
  const now = new Date();
  const timestamps = Array(5)
    .fill(null)
    .map((_, i) => {
      const date = new Date(now.getTime() - i * 3600000);
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    })
    .reverse();

  // Generate dynamic recentPredictions data
  const recentPredictions = [
    {
      timestamp: timestamps[4],
      prediction:
        bidAmount >= 1.0
          ? "Low Risk"
          : bidAmount >= 0.5
          ? "Medium Risk"
          : "High Risk",
      confidence: Math.min(0.95, 0.75 + Math.random() * 0.2),
      action:
        bidAmount >= 1.0
          ? "No Action"
          : bidAmount >= 0.5
          ? "Increased Bid"
          : "Emergency Bid",
    },
    {
      timestamp: timestamps[3],
      prediction: "Medium Risk",
      confidence: Math.min(0.9, 0.7 + Math.random() * 0.2),
      action: "Increased Bid",
    },
    {
      timestamp: timestamps[2],
      prediction: "High Risk",
      confidence: Math.min(0.92, 0.8 + Math.random() * 0.1),
      action: "Emergency Bid",
    },
  ];

  const decayData = [
    { time: "0h", decayRate: 0.15, predictedDecay: 0.15 },
    { time: "3h", decayRate: 0.18, predictedDecay: 0.17 },
    { time: "6h", decayRate: 0.22, predictedDecay: 0.2 },
    { time: "9h", decayRate: 0.25, predictedDecay: 0.23 },
    { time: "12h", decayRate: 0.29, predictedDecay: 0.26 },
    { time: "15h", decayRate: 0.32, predictedDecay: 0.3 },
    { time: "18h", decayRate: 0.36, predictedDecay: 0.34 },
    { time: "21h", decayRate: 0.4, predictedDecay: 0.38 },
  ]

  // Dynamically adjust evictionRiskFactors based on bidAmount
  const evictionRiskFactors = [
    { factor: "Time Pressure", score: Math.min(100, 50 + bidAmount * 20) },
    { factor: "Bid Competition", score: Math.min(100, 60 + bidAmount * 18) },
    { factor: "Market Volatility", score: Math.max(10, 50 - bidAmount * 15) },
    {
      factor: "Historical Stability",
      score: Math.min(100, 70 + bidAmount * 10),
    },
    { factor: "Network Load", score: Math.min(100, 55 + bidAmount * 12) },
  ];

  const metrics = {
    riskMetrics: {
      currentRisk: riskFactor,
      optimalBid: bidAmount * (1 + Math.random() * 0.2),
      timeToEviction:
        bidAmount >= 1.0 ? "10 Days" : bidAmount >= 0.5 ? "5 Days" : "2 Days",
      budgetUtilization: utilizationFactor,
    },
    historicalData: timestamps.map((timestamp, i) => ({
      timestamp,
      risk: Math.max(
        0.1,
        Math.min(0.9, riskFactor + (Math.random() * 0.3 - 0.15))
      ),
      bid: bidAmount * (0.7 + Math.random() * 0.6),
      threshold: bidAmount * (1.2 + Math.random() * 0.3),
    })),
    modelMetrics: {
      accuracy: Math.min(98, 85 + bidAmount * 10),
      precision: Math.min(97, 82 + bidAmount * 12),
      recall: Math.min(98, 84 + bidAmount * 11),
      f1Score: Math.min(97, 83 + bidAmount * 11),
    },
    contractParams: {
      minBid: Math.min(0.0015, 85 + bidAmount * 10),
      currentBid: bidAmount,
      evictionThreshold: Math.min(0.003, 84 + bidAmount * 11),
      userStake: Math.min(0.00005, 83 + bidAmount * 11),
    },
    aiMetrics: {
      bidDifference: bidAmount * (0.1 + Math.random() * 0.1),
      timePressure: riskFactor + Math.random() * 0.1,
      stakeToBidRatio: bidAmount * (2 + Math.random()),
      predictionAccuracy: Math.min(98, 90 + bidAmount * 5),
      lastOptimization: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
    recentPredictions,
    evictionRiskFactors,
    decayData
  };

  return res.status(200).json(metrics);
});

// Static data endpoint
app.get("/dashboard-data", validateApiKey, (req, res) => {
  const staticData = {
    recentPredictions: [
      {
        timestamp: "15:45",
        prediction: "Low Risk",
        confidence: 0.85,
        action: "No Action",
      },
      {
        timestamp: "15:30",
        prediction: "Medium Risk",
        confidence: 0.75,
        action: "Increased Bid",
      },
      {
        timestamp: "15:15",
        prediction: "High Risk",
        confidence: 0.92,
        action: "Emergency Bid",
      },
    ],
    decayData: [
      { time: "0h", decayRate: 0.15, predictedDecay: 0.15 },
      { time: "3h", decayRate: 0.18, predictedDecay: 0.17 },
      { time: "6h", decayRate: 0.22, predictedDecay: 0.2 },
      { time: "9h", decayRate: 0.25, predictedDecay: 0.23 },
      { time: "12h", decayRate: 0.29, predictedDecay: 0.26 },
      { time: "15h", decayRate: 0.32, predictedDecay: 0.3 },
      { time: "18h", decayRate: 0.36, predictedDecay: 0.34 },
      { time: "21h", decayRate: 0.4, predictedDecay: 0.38 },
    ],
    contractParams: {
      minBid: 0.15,
      timeLeft: "2h 15m",
      currentBid: 0.22,
      evictionThreshold: 0.3,
      userStake: 1.5,
    },
    evictionRiskFactors: [
      { factor: "Time Pressure", score: 65 },
      { factor: "Bid Competition", score: 78 },
      { factor: "Market Volatility", score: 45 },
      { factor: "Historical Stability", score: 82 },
      { factor: "Network Load", score: 58 },
    ],
    riskMetrics: {
      currentRisk: 0.35,
      optimalBid: 0.25,
      timeToEviction: "10 Days",
      budgetUtilization: 65,
    },
    historicalData: [
      { timestamp: "12:00", risk: 0.3, bid: 0.15, threshold: 0.4 },
      { timestamp: "13:00", risk: 0.25, bid: 0.38, threshold: 0.5 },
      { timestamp: "14:00", risk: 0.15, bid: 0.25, threshold: 0.4 },
      { timestamp: "15:00", risk: 0.28, bid: 0.42, threshold: 0.325 },
      { timestamp: "16:00", risk: 0.42, bid: 0.24, threshold: 0.309 },
    ],
    modelMetrics: {
      accuracy: 92,
      precision: 89,
      recall: 94,
      f1Score: 91,
    },
    aiMetrics: {
      bidDifference: 0.08,
      timePressure: 0.45,
      stakeToBidRatio: 6.82,
      predictionAccuracy: 94.5,
      lastOptimization: "5 minutes ago",
    },
  };

  res.json(staticData);
});

// Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`AI Calculation Service running on port ${PORT}`);
});
