/**
 * EpiCurrents EDF file loader.
 * @package    @epicurrents/edf-file-loader
 * @copyright  2023 Sampsa Lohi
 * @license    Apache-2.0
 */

import { SETTINGS, SignalFileLoader } from '@epicurrents/core'
import { type EdfHeader } from '../types/edf'
import { Log } from 'scoped-ts-log'

const SCOPE = 'EdfFileReader'

export default class EdfFileReader extends SignalFileLoader {

    constructor () {
        super()
    }

    /**
     * Cache certain header information for use in async, progressive loading.
     * @param header - Parsed EdfHeader.
     * @param dataRecordSize - The size of a single data record in bytes.
     */
    cacheEdfInfo (header: EdfHeader, dataRecordSize: number) {
        this._dataOffset = header.headerRecordBytes
        this._dataUnitCount = header.dataRecordCount
        this._dataUnitDuration = header.dataRecordDuration
        this._dataUnitSize = dataRecordSize
        this._chunkUnitCount = this._dataUnitSize*2 < SETTINGS.app.dataChunkSize
                                ? Math.floor(SETTINGS.app.dataChunkSize/(this._dataUnitSize)) - 1
                                : 1
        Log.debug(`Cached EDF info for recording '${header.patientId}'.`, SCOPE)
    }
}
