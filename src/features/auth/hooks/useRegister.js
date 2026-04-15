import { useMutation } from '@tanstack/react-query'
import { registerStudentApi, registerFacultyApi } from '../auth.api'

export function useRegisterStudent() {
  return useMutation({
    mutationFn: (data) => registerStudentApi(data),
  })
}

export function useRegisterFaculty() {
  return useMutation({
    mutationFn: (data) => registerFacultyApi(data),
  })
}