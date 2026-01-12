@ManyToOne(() => User, user => user.boards)
owner: User;

