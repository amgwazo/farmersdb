import React from 'react'

function Home() {
   const array = [1,2,3,4,5];

  return (
    <div className="text-success w-50 m-auto">
      <h1>Home</h1>
      <table>
        <thead>
          <tr>
            <th>test</th>
            <th>test2</th>
          </tr>
        </thead>
        <tbody>
          {array.map((me) => (
            
              <tr>
                <td>{me}</td>
                <td> {me}</td>
              </tr>
           
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Home
