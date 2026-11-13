const suites=['cadastro','agenda-encaminhamentos','permissoes','prontuario','odontologia'];
(async()=>{let total=0;for(const suite of suites){const result=await require('./'+suite+'.test.cjs');total+=result.checks;}console.log('Total: '+total+' verificações.');})().catch(error=>{console.error(error);process.exitCode=1;});
