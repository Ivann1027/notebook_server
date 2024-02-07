export type ValidatedUser = {
	user: {
		id: number
		name: string
		email: string
	}
	accessToken: Promise<string>
}