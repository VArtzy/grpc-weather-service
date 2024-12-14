import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'

const PROTO_PATH = './proto/weather.proto'

const packageDefinition = protoLoader.loadSync(PROTO_PATH)

const weatherProto = grpc.loadPackageDefinition(packageDefinition)

const weatherStations = [
  { stationId: 'WS001', location: 'New York', latitude: 40.7128, longitude: -74.0060 },
  { stationId: 'WS002', location: 'Los Angeles', latitude: 34.0522, longitude: -118.2437 }
]

const weatherService = {
    GetWeatherStations: call => {
        const region = call.request.region

        weatherStations.forEach(ws => {
            if (!region || ws.location.includes(region)) {
                call.write(ws)
            }
        })

        call.end()
    },

    MonitorWeatherUpdates: call => {
        const station = call.request

        const updateInterval = setInterval(() => {
            const weatherData = {
                stationId: station.stationId,
                temperature: Math.random() * 40 - 10,
                humidity: Math.random() * 100,
                windSpeed: Math.random() * 50,
                timestamp: Date.now()
            }

            call.write(weatherData)
        }, 2000)

        call.on('cancelled', () => {
            clearInterval(updateInterval)
            call.end()
        })
    },

    ReportStationDiagnostics: (call, cb) => {
        const diagnosticData = []

        call.on('data', weatherData => {
            diagnosticData.push(weatherData)
        })

        call.on('end', () => {
            const isHealthy = diagnosticData.every(data => data.temperature > -50 && data.temperature < 50 && data.humidity >= 0 && data.humidity <= 100)

            cb(null, {
                isHealthy,
                message: isHealthy ? 'Station is functioning normally' : 'Potential issues detected with station'
            })
        })
    }
}

const server = new grpc.Server()

server.addService(
    weatherProto.weather.WeatherService.service,
    weatherService
)

server.bindAsync(
    '0.0.0.0:40000',
    grpc.ServerCredentials.createInsecure(),
    (error, port) => {
        if (error) throw new Error('Server bind failed: ' + error)
        console.log('Server is running on ' + port)
    }
)
