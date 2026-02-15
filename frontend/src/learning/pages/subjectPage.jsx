import "../learning.css";
function SubjectPage({ subject, goBack, goToMission }) {

const subjectMissions = {

  1: [   // Operating Systems
    { id: 1, title: "OS Basics", xp: 50 },
    { id: 2, title: "Processes & Threads", xp: 60 },
    { id: 3, title: "CPU Scheduling", xp: 70 },
    { id: 4, title: "Deadlocks & Synchronization", xp: 70 },
    { id: 5, title: "Memory Management", xp: 80 },
  ],

  2: [   // Computer Networks
    { id: 1, title: "OSI Model", xp: 50 },
    { id: 2, title: "TCP/IP Model", xp: 60 },
    { id: 3, title: "Routing & Switching", xp: 60 },
    { id: 4, title: "Protocols (HTTP, FTP, etc.)", xp: 70 },
    { id: 5, title: "Congestion & Flow Control", xp: 80 },
  ],

  3: [   // DBMS
    { id: 1, title: "DBMS Basics", xp: 50 },
    { id: 2, title: "ER Model", xp: 60 },
    { id: 3, title: "Normalization", xp: 70 },
    { id: 4, title: "SQL", xp: 80 },
    { id: 5, title: "Transactions & Concurrency", xp: 80 },
  ],

  4: [   // OOPS
    { id: 1, title: "OOPS Principles", xp: 50 },
    { id: 2, title: "Encapsulation", xp: 60 },
    { id: 3, title: "Inheritance", xp: 60 },
    { id: 4, title: "Polymorphism", xp: 70 },
    { id: 5, title: "Abstraction", xp: 70 },
  ],

  5: [   // Aptitude
    { id: 1, title: "Percentage", xp: 50 },
    { id: 2, title: "Profit & Loss", xp: 60 },
    { id: 3, title: "Time & Work", xp: 60 },
    { id: 4, title: "Probability", xp: 70 },
    { id: 5, title: "Number System", xp: 70 },
  ],

};


  const missions = subjectMissions[subject.id] || [];


  return (
    <div className="learning-container">
      <button className="btn" onClick={goBack}>⬅ Back</button>

      <h2 className="learning-title">🎯 {subject.name}</h2>

      {missions.map((mission) => (
        <div
          key={mission.id}
          className="card"
          onClick={() => goToMission(mission)}
        >
          <h3>{mission.title}</h3>
          <p className="xp-text">Reward: +{mission.xp} XP</p>
        </div>
      ))}
    </div>
  );
}



export default SubjectPage;
