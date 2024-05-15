





1) Where would you fit your automated tests in your Recipe project development pipeline? Select one of the following and explain why.

Answer: Within a Github action that runs whenever code is pushed. This is so I could see the merge errors as well CI integration. It's also more efficient and I can see how the new code works with the rest of the code base.

2) Would you use an end to end test to check if a function is returning the correct output? (yes/no)

Answer: No, there are too many moving parts that are involved from end to end. It's better to test the function by itself.