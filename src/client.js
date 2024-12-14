import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'

const PROTO_PATH = './proto/weather.proto'

const packageDefinition = protoLoader.loadSync(PROTO_PATH)

const weatherProto = grpc.loadPackageDefinition(packageDefinition)

const client = new weatherProto.weather.WeatherService(
    'localhost:40000',
    grpc.credentials.createInsecure()
)

function unaryRPC(client) {
    const call = client.GetWeatherStations({ region: 'Los' })

    call.on('data', (station) => {
        console.log('Weather station found: ' + JSON.stringify(station))
    })

    call.on('end', () => {
        console.log('Stream ended')
    })
}

function clientStreamRPC(client) {
    const call = client.ReportStationDiagnostics((error, response) => {
        if (error) throw new Error('Diagnostic report error: ' + error)
        console.log('Station diagnostic result: ' + JSON.stringify(response))
    })

    const diagnosticData = [
        { stationId: 'WS001', temperature: 25, humidity: 60 },
        { stationId: 'WS001', temperature: 26, humidity: 62 }
    ]

    diagnosticData.forEach(dd => call.write(dd))
    call.end()
}


function serverStreamRPC(client) {
    const station = { stationId: 'WS001' }
    const call = client.MonitorWeatherUpdates(station)

    call.on('data', weatherData => {
        console.log('Weather update: ' + JSON.stringify(weatherData))
    })

    call.on('end', () => {
        console.log('Stream ended')
    })
}

unaryRPC(client)
serverStreamRPC(client)
clientStreamRPC(client)
