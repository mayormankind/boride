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
  