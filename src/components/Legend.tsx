import React from 'react'
import { frames } from '../lib/frames'

export const Legend = () => {
  return (
    <div>
      <h2>Legend</h2>
      <table>
        <tbody>
          {frames.map((frame) => (
            <tr key={frame.name}>
              <td>{frame.name}</td>
              <td style={{ backgroundColor: frame.color }}>&nbsp;&nbsp;</td>
            </tr>
          ))}
        </tbody>
      </table>
      <style jsx>
        {`
          table td {
            padding: 0.2em;
          }
        `}
      </style>
    </div>
  )
}
