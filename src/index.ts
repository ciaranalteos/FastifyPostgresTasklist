import Fastify from 'fastify';
import fs from 'fs/promises';
import { createClient } from "@supabase/supabase-js";

const fastify = Fastify();

const supabaseUrl = "https://txysbpwypxoxfznyhsde.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4eXNicHd5cHhveGZ6bnloc2RlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1ODUyNTcsImV4cCI6MjA2NTE2MTI1N30.TbeeTkdSbnRQd4HaNGQ0ipUIzSHejHSi4JxsGQ-Zdn4";
const supabase = createClient(supabaseUrl, supabaseKey);

type editresult = {
  newstatus: boolean;
  taskname: string
}

async function addtask(entryname: string): Promise<void> {
  const { data, error } = await supabase.from('tasklist')
  .insert([{ "task": entryname, status: false }]);
  if (error) console.error(error);
  else console.log(data);
}

async function deletetask(numid: number): Promise<void> {
  const { data, error } = await supabase
    .from('tasklist')
    .delete()
    .eq('id', numid);

  if (error) {
    console.error('Delete error:', error.message);
  } else {
    console.log('Delete success:', data);
  }
}

async function edittask(numid: number): Promise<editresult | void> {
  
  const { data, error } = await supabase
  .from('tasklist')
  .select('status, task')
  .eq('id', Number(numid))
  .single();

  if (error) {
    console.error(error);
    return
  }

  const newdata: editresult = {
    newstatus: !data.status,
    taskname: data.task
  }

  const { data: patchdata } = await supabase
    .from('tasklist')
    .update({ "status": newdata.newstatus })
    .eq('id', numid);

  return newdata
}

async function fetchtasks(): Promise<void | object> {
  const { data, error } = await supabase
    .from('tasklist')
    .select("*")
    .order('id', { ascending: true });

  if (error) {
    console.error('fetch error:', error.message);
  } else {
    console.log('to do list:', data);
    return data
  }
}

fastify.get('/', async (request) => {
  return fetchtasks();
});

fastify.post('/', async (request) => {
  const body = request.body as {task: string};
  const entryname = body.task
  await addtask(entryname);
  console.log(`task ${entryname} has been added to the task list`)
  return { message: `task ${entryname} has been added to the task list` };
});

fastify.patch('/:id', async (request: any) => {
  const patchid = Number(request.params.id);
  const newdata = await edittask(patchid);
  if(newdata)
    {if(newdata.newstatus == true){
        console.log(`task with the ID ${patchid} (${newdata.taskname}) has been marked as finished`)
        return { message: `task with the ID ${patchid} (${newdata.taskname}) has marked as finished` };
      } else {
        console.log(`task with the ID ${patchid} (${newdata.taskname}) has been marked as not finished`)
        return { message: `task with the ID ${patchid} (${newdata.taskname}) has marked as not finished` };}}
  else return
});

fastify.delete('/:id', async (request) => {
  const { id } = request.params as {id: string}
  const numid = Number(id)
  await deletetask(numid);
  console.log(`task ${id} has been deleted to the task list`)
  return { message: `task ${id} has been deleted to the task list` };
});

async function start() {
  fastify.listen({ port: 3000 }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server running at ${address}`);
  });
}

start();
