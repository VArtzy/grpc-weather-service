# Weather Monitoring gRPC Service

## Overview

This project demonstrates a real-time weather monitoring system using gRPC (gRPC Remote Procedure Call) with Node.js. It showcases different gRPC communication patterns and provides a robust example of building distributed microservices.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/weather-monitoring-grpc.git
   cd weather-monitoring-grpc
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Project

### Start the Server

```bash
npm run start:server
```

The server will start and listen on `localhost:40000`.

### Run the Client

```bash
npm run start:client
```

This will demonstrate three RPC types:
1. Fetching weather stations
2. Streaming real-time weather updates
3. Reporting station diagnostics

## gRPC Communication Patterns

### 1. Unary RPC: Get Weather Stations
- **Endpoint**: `GetWeatherStations`
- Retrieve weather stations based on a region
- Returns a stream of matching weather stations

### 2. Server Streaming RPC: Monitor Weather Updates
- **Endpoint**: `MonitorWeatherUpdates`
- Continuously streams real-time weather data for a specific station
- Updates sent every 2 seconds with simulated data

### 3. Client Streaming RPC: Report Station Diagnostics
- **Endpoint**: `ReportStationDiagnostics`
- Client sends multiple diagnostic data points
- Server analyzes and returns overall station health status

## Protocol Buffers

The project uses Protocol Buffers (`weather.proto`) to define:
- Message structures
- Service definitions
- Data types for weather stations and data

## Technologies

- gRPC
- Node.js
- Protocol Buffers
