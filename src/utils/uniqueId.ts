// Uniqeu ID Generator Using Snowflake Algorithm
// Parameters: 41 bits timestamp, 10 bits machine id, 12 bits sequence

import os from 'os'

export class UniqueIdGenerator {
  static instance: UniqueIdGenerator | null = null
  private timestampBits: bigint
  private machineIdBits: bigint
  private sequenceBits: bigint
  private maxTimestamp: bigint
  private maxMachineId: bigint
  private maxSequence: bigint
  private machineId: bigint
  private sequence: bigint
  private lastTimestamp: bigint
  private EPOCH: bigint

  private constructor() {
    // Initialize bits
    this.timestampBits = BigInt(41)
    this.machineIdBits = BigInt(10)
    this.sequenceBits = BigInt(12)

    // Initialize maximum values
    this.maxTimestamp = BigInt(2) ** this.timestampBits - BigInt(1)
    this.maxMachineId = BigInt(2) ** this.machineIdBits - BigInt(1)
    this.maxSequence = BigInt(2) ** this.sequenceBits - BigInt(1)

    // Initialize id generation configurations
    this.machineId = this.generateMachineId()
    this.sequence = BigInt(0)
    this.lastTimestamp = BigInt(-1)
    this.EPOCH = BigInt(1609459200000) // 2021-01-01 00:00:00
  }

  private generateMachineId(): bigint {
    // Parse Network Interfaces
    const interfaces = os.networkInterfaces()
    let macAddress = ''

    // Get the first non-internal IPv4 address
    for (const values of Object.values(interfaces)) {
      // Skip if values is empty or undefined
      if ((values && values.length === 0) || values === undefined) {
        continue
      }

      // Get the first non-internal IPv4 address
      for (const item of values) {
        if (item && item.family === 'IPv4' && !item.internal) {
          macAddress = item.mac
          break
        }
      }
    }

    // Generate machine id from mac address
    let machineId = BigInt(0)
    if (macAddress) {
      machineId = BigInt(parseInt(macAddress.split(':').join(''), 16))
    }
    machineId = machineId & this.maxMachineId

    return machineId
  }

  private async waitNextMillis(lastTimestamp: bigint): Promise<bigint> {
    // Wait until next millisecond and return timestamp
    let timestamp = BigInt(Date.now())
    while (timestamp <= lastTimestamp) {
      timestamp = BigInt(Date.now())
    }
    return timestamp
  }

  async nextId(): Promise<string> {
    // Generate next unique id
    let timestamp = BigInt(Date.now())
    if (timestamp < this.lastTimestamp) {
      while (timestamp < this.lastTimestamp) {
        timestamp = BigInt(Date.now())
      }
    }

    // Update sequence if timestamp is same as last timestamp
    if (this.lastTimestamp === timestamp) {
      this.sequence = (this.sequence + BigInt(1)) & this.maxSequence
      if (this.sequence === BigInt(0)) {
        timestamp = await this.waitNextMillis(this.lastTimestamp)
      }
    } else {
      this.sequence = BigInt(0)
    }
    this.lastTimestamp = timestamp

    // Generate unique id
    const uniqueId =
      ((timestamp - this.EPOCH) << (this.machineIdBits + this.sequenceBits)) |
      (this.machineId << this.sequenceBits) |
      this.sequence
    return uniqueId.toString()
  }

  async getIdByTimestamp(timestamp: number): Promise<string> {
    // Generate id from timestamp
    const id =
      ((BigInt(timestamp) - this.EPOCH) << (this.machineIdBits + this.sequenceBits)) |
      (BigInt(0) << this.sequenceBits) |
      BigInt(0)
    return id.toString()
  }

  static getInstance(): UniqueIdGenerator {
    if (!this.instance) {
      this.instance = new UniqueIdGenerator()
    }
    return this.instance
  }
}
