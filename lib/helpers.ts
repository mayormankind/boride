export function buildStudentPayload(data: any) {
    const isMatric = /^\d{2}\/\d{4}$/.test(data.identifier);
  
    if (isMatric) {
      return {
        matricNo: data.identifier,
        password: data.password,
      };
    }
  
    // else use email
    return {
      email: data.identifier,
      password: data.password,
    };
  }

export function buildDriverPayload(data: any) {
    return {
      email: data.identifier,
      password: data.password,
    };
  }
  
export const STATUS_CONFIG = {
    pending: {
      label: 'Searching for driver',
      color: 'bg-yellow-500',
    },
    accepted: {
      label: 'Driver accepted (on the way)',
      color: 'bg-indigo-500',
    },
    ongoing: {
      label: 'Trip in progress',
      color: 'bg-green-500',
    },
    completed: {
      label: 'Completed',
      color: 'bg-gray-500',
    },
    cancelled: {
      label: 'Cancelled',
      color: 'bg-red-500',
    },
  } as const;
  
export type RideStatus = keyof typeof STATUS_CONFIG;
  