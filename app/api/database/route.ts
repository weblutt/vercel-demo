import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  try {
    switch (action) {
      case 'create-table':
        await sql`
          CREATE TABLE IF NOT EXISTS students (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            age INTEGER,
            major VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
        `;
        return NextResponse.json({ message: '表创建成功' }, { status: 200 });

      case 'insert':
        const name = searchParams.get('name') || '未知';
        const age = parseInt(searchParams.get('age') || '18');
        const major = searchParams.get('major') || '未选择专业';
        
        await sql`
          INSERT INTO students (name, age, major)
          VALUES (${name}, ${age}, ${major});
        `;
        return NextResponse.json({ message: '数据插入成功' }, { status: 200 });

      case 'select':
        const result = await sql`
          SELECT * FROM students ORDER BY created_at DESC;
        `;
        return NextResponse.json({ data: result.rows }, { status: 200 });

      case 'delete':
        const id = parseInt(searchParams.get('id') || '0');
        if (id > 0) {
          await sql`DELETE FROM students WHERE id = ${id};`;
          return NextResponse.json({ message: '删除成功' }, { status: 200 });
        }
        return NextResponse.json({ error: '无效的ID' }, { status: 400 });

      default:
        return NextResponse.json({ 
          message: '请指定操作类型',
          available_actions: ['create-table', 'insert', 'select', 'delete']
        }, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
