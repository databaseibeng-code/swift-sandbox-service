import express from "express";

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;
const TOKEN = process.env.SANDBOX_SERVICE_TOKEN;

// Health check
app.get("/health", (_, res) => {
  res.json({
    ok: true,
    service: "swift-sandbox-service",
  });
});

// Middleware auth token
app.use((req, res, next) => {
  const auth = req.headers.authorization;

  if (!TOKEN) {
    return res.status(500).json({
      error: "Sandbox token missing",
    });
  }

  if (auth !== `Bearer ${TOKEN}`) {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  next();
});

// Example execute endpoint
app.post("/execute", async (req, res) => {
  try {
    const { projectId } = req.body;

    return res.json({
      success: true,
      message: "Sandbox execution ready",
      projectId,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Execution failed",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Sandbox service running on port ${PORT}`);
});