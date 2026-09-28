import React from 'react';
import { FiPhone, FiTruck, FiShield, FiCrosshair } from 'react-icons/fi';

const EmergencyContacts = () => {
  const contacts = [
    { label: 'Police', number: '100', icon: FiShield, color: 'text-primary' },
    { label: 'Fire Brigade', number: '101', icon: FiTruck, color: 'text-danger' },
    { label: 'Ambulance', number: '102', icon: FiCrosshair, color: 'text-success' },
    { label: 'Disaster Helpline', number: '1078', icon: FiPhone, color: 'text-warning' },
  ];

  return (
    <div className="bg-card border border-gray-800 p-6 rounded-2xl shadow-sm">
      <h3 className="text-xl font-bold text-white mb-4">Emergency Contacts</h3>
      <div className="grid grid-cols-2 gap-4">
        {contacts.map((contact, i) => (
          <div key={i} className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-xl border border-gray-700/50">
            <div className={`p-2 rounded-lg bg-gray-800 ${contact.color}`}>
              <contact.icon />
            </div>
            <div>
              <p className="text-xs text-gray-400">{contact.label}</p>
              <p className="font-bold text-white tracking-wide">{contact.number}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmergencyContacts;
